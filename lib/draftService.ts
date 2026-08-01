import { supabase } from './supabase';

export const DRAFT_EXPIRATION_DAYS = 180;

export interface QuestionnaireDraft {
  id?: string;
  token: string;
  questionnaire_type: 'brand' | 'artist' | string;
  payload: Record<string, any>;
  current_step: number;
  total_steps?: number;
  completion_percentage: number;
  completed_fields_count?: number;
  total_fields_count?: number;
  status: 'in_progress' | 'completed' | 'expired';
  company_or_artist_name?: string;
  contact_email?: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

const LOCAL_STORAGE_KEY = 'fm_draft_questionnaires_store';

/**
 * Generates an unpredictable, secure high-entropy token (e.g. "5dQm82LpYtA91")
 */
export const generateDraftToken = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const array = new Uint8Array(14);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 14; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  let result = '';
  for (let i = 0; i < 14; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
};

/**
 * Returns full absolute URL for resuming the questionnaire draft
 */
export const getResumeUrl = (token: string): string => {
  if (typeof window === 'undefined') return `/resume/${token}`;
  const origin = window.location.origin;
  const pathname = window.location.pathname.replace(/\/$/, '');
  return `${origin}${pathname}/#/resume/${token}`;
};

/**
 * Fallback local & settings store helpers
 */
const getLocalDrafts = (): QuestionnaireDraft[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalDrafts = (drafts: QuestionnaireDraft[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(drafts));
  } catch (e) {
    console.warn("Failed to save drafts to localStorage:", e);
  }
};

const syncWithSettingsFallback = async (drafts: QuestionnaireDraft[]) => {
  try {
    await supabase.from('settings').upsert({
      id: 'draft_questionnaires_fallback',
      mutey_rules: JSON.stringify(drafts)
    });
  } catch (e) {
    // silent
  }
};

/**
 * Helper to calculate expiration date ISO string
 */
export const calculateExpirationDate = (days = DRAFT_EXPIRATION_DAYS): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

/**
 * Saves or updates a draft in Supabase draft_questionnaires table (with resilient fallback)
 */
export const saveDraft = async (
  draftData: Partial<QuestionnaireDraft> & { questionnaire_type: string; payload: Record<string, any> }
): Promise<{ success: boolean; token: string; draft: QuestionnaireDraft; error?: string }> => {
  const now = new Date().toISOString();
  const token = draftData.token || generateDraftToken();
  const expires_at = draftData.expires_at || calculateExpirationDate();

  const fullDraft: QuestionnaireDraft = {
    id: draftData.id || token,
    token,
    questionnaire_type: draftData.questionnaire_type,
    payload: draftData.payload || {},
    current_step: draftData.current_step || 1,
    total_steps: draftData.total_steps || 1,
    completion_percentage: draftData.completion_percentage || 0,
    completed_fields_count: draftData.completed_fields_count || 0,
    total_fields_count: draftData.total_fields_count || 0,
    status: draftData.status || 'in_progress',
    company_or_artist_name: draftData.company_or_artist_name || draftData.payload?.company_name || draftData.payload?.artist_name || 'Bozza senza nome',
    contact_email: draftData.contact_email || draftData.payload?.email || '',
    created_at: draftData.created_at || now,
    updated_at: now,
    expires_at
  };

  let savedInSupabase = false;

  try {
    const dbPayload = {
      token: fullDraft.token,
      questionnaire_type: fullDraft.questionnaire_type,
      payload: fullDraft.payload,
      current_step: fullDraft.current_step,
      completion_percentage: fullDraft.completion_percentage,
      status: fullDraft.status,
      updated_at: fullDraft.updated_at,
      expires_at: fullDraft.expires_at
    };

    // Try upserting to draft_questionnaires
    const { data, error } = await supabase
      .from('draft_questionnaires')
      .upsert(dbPayload, { onConflict: 'token' })
      .select()
      .maybeSingle();

    if (!error) {
      savedInSupabase = true;
      if (data?.id) fullDraft.id = data.id;
    } else {
      console.warn("Table draft_questionnaires error, using fallback storage:", error.message);
    }
  } catch (err: any) {
    console.warn("Supabase query exception for draft_questionnaires:", err?.message || err);
  }

  // Always sync with local and settings fallback so draft is never lost
  const localList = getLocalDrafts();
  const existingIndex = localList.findIndex(d => d.token === token);
  if (existingIndex >= 0) {
    localList[existingIndex] = fullDraft;
  } else {
    localList.unshift(fullDraft);
  }
  saveLocalDrafts(localList);
  syncWithSettingsFallback(localList);

  return {
    success: true,
    token: fullDraft.token,
    draft: fullDraft
  };
};

/**
 * Retrieves a draft by token
 */
export const getDraftByToken = async (
  token: string
): Promise<{ success: boolean; draft: QuestionnaireDraft | null; error?: string }> => {
  if (!token) return { success: false, draft: null, error: 'Token non valido' };

  try {
    const { data, error } = await supabase
      .from('draft_questionnaires')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (!error && data) {
      const draft: QuestionnaireDraft = {
        id: data.id,
        token: data.token,
        questionnaire_type: data.questionnaire_type,
        payload: typeof data.payload === 'string' ? JSON.parse(data.payload) : data.payload || {},
        current_step: data.current_step || 1,
        completion_percentage: data.completion_percentage || 0,
        status: data.status || 'in_progress',
        created_at: data.created_at,
        updated_at: data.updated_at,
        expires_at: data.expires_at
      };

      // Check expiration
      if (draft.expires_at && new Date(draft.expires_at).getTime() < Date.now() && draft.status === 'in_progress') {
        draft.status = 'expired';
      }

      return { success: true, draft };
    }
  } catch (e) {
    console.warn("Supabase lookup failed for draft, checking fallback:", e);
  }

  // Fallback lookup from localStorage or settings fallback
  const localList = getLocalDrafts();
  let localMatch = localList.find(d => d.token === token);

  if (!localMatch) {
    try {
      const { data: fallbackData } = await supabase
        .from('settings')
        .select('mutey_rules')
        .eq('id', 'draft_questionnaires_fallback')
        .maybeSingle();

      if (fallbackData?.mutey_rules) {
        const parsedList: QuestionnaireDraft[] = JSON.parse(fallbackData.mutey_rules);
        localMatch = parsedList.find(d => d.token === token);
      }
    } catch (e) {
      // ignore
    }
  }

  if (localMatch) {
    if (localMatch.expires_at && new Date(localMatch.expires_at).getTime() < Date.now() && localMatch.status === 'in_progress') {
      localMatch.status = 'expired';
    }
    return { success: true, draft: localMatch };
  }

  return { success: false, draft: null, error: 'Bozza non trovata o token non valido' };
};

/**
 * Marks a draft as completed/submitted so link cannot be edited further
 */
export const markDraftCompleted = async (token: string): Promise<boolean> => {
  if (!token) return false;

  try {
    await supabase
      .from('draft_questionnaires')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('token', token);
  } catch (e) {
    // ignore
  }

  // Update local storage
  const localList = getLocalDrafts();
  const index = localList.findIndex(d => d.token === token);
  if (index >= 0) {
    localList[index].status = 'completed';
    localList[index].updated_at = new Date().toISOString();
    saveLocalDrafts(localList);
    syncWithSettingsFallback(localList);
  }

  return true;
};

/**
 * Retrieves all drafts for Admin Dashboard
 */
export const getAllDrafts = async (): Promise<QuestionnaireDraft[]> => {
  let drafts: QuestionnaireDraft[] = [];

  try {
    const { data, error } = await supabase
      .from('draft_questionnaires')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!error && data && Array.isArray(data)) {
      drafts = data.map(item => ({
        id: item.id,
        token: item.token,
        questionnaire_type: item.questionnaire_type,
        payload: typeof item.payload === 'string' ? JSON.parse(item.payload) : item.payload || {},
        current_step: item.current_step || 1,
        completion_percentage: item.completion_percentage || 0,
        status: item.status || 'in_progress',
        company_or_artist_name: item.company_or_artist_name || item.payload?.company_name || item.payload?.artist_name || 'Bozza senza nome',
        contact_email: item.contact_email || item.payload?.email || '',
        created_at: item.created_at,
        updated_at: item.updated_at,
        expires_at: item.expires_at
      }));
    }
  } catch (e) {
    console.warn("Failed fetching drafts from Supabase table:", e);
  }

  // Merge with local/settings fallback if Supabase table returned empty or error
  const localList = getLocalDrafts();
  if (drafts.length === 0 && localList.length > 0) {
    drafts = localList;
  } else {
    // combine unique by token
    const map = new Map<string, QuestionnaireDraft>();
    drafts.forEach(d => map.set(d.token, d));
    localList.forEach(d => {
      if (!map.has(d.token)) map.set(d.token, d);
    });
    drafts = Array.from(map.values());
  }

  // Check expiration status on all drafts
  const now = Date.now();
  drafts = drafts.map(d => {
    if (d.expires_at && new Date(d.expires_at).getTime() < now && d.status === 'in_progress') {
      return { ...d, status: 'expired' };
    }
    return d;
  });

  // Sort by updated_at desc
  drafts.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return drafts;
};

/**
 * Deletes a draft by token or ID
 */
export const deleteDraft = async (tokenOrId: string): Promise<boolean> => {
  if (!tokenOrId) return false;

  try {
    await supabase
      .from('draft_questionnaires')
      .delete()
      .or(`token.eq.${tokenOrId},id.eq.${tokenOrId}`);
  } catch (e) {
    // ignore
  }

  const localList = getLocalDrafts();
  const filtered = localList.filter(d => d.token !== tokenOrId && d.id !== tokenOrId);
  saveLocalDrafts(filtered);
  syncWithSettingsFallback(filtered);

  return true;
};
