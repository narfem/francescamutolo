import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  saveDraft, 
  getDraftByToken, 
  markDraftCompleted, 
  getResumeUrl, 
  QuestionnaireDraft 
} from '../lib/draftService';

interface UseQuestionnaireDraftOptions {
  questionnaireType: 'brand' | 'artist' | string;
  formData: Record<string, any>;
  currentStep: number;
  totalSteps: number;
  companyOrArtistName?: string;
  contactEmail?: string;
  extraState?: Record<string, any>;
  initialToken?: string | null;
  autosaveIntervalMs?: number; // default 30000 (30 seconds)
}

export function useQuestionnaireDraft({
  questionnaireType,
  formData,
  currentStep,
  totalSteps,
  companyOrArtistName,
  contactEmail,
  extraState = {},
  initialToken = null,
  autosaveIntervalMs = 30000
}: UseQuestionnaireDraftOptions) {
  const [activeToken, setActiveToken] = useState<string | null>(initialToken);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string>('');

  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;

  const extraStateRef = useRef(extraState);
  extraStateRef.current = extraState;

  // Compute completion metrics
  const computeMetrics = useCallback(() => {
    let filled = 0;
    let total = 0;

    const checkValue = (val: any) => {
      if (val === null || val === undefined) return false;
      if (typeof val === 'string') return val.trim().length > 0;
      if (typeof val === 'number' || typeof val === 'boolean') return true;
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === 'object') return Object.keys(val).length > 0;
      return false;
    };

    // Scan formData
    Object.values(formDataRef.current).forEach(val => {
      total++;
      if (checkValue(val)) filled++;
    });

    // Scan extraState
    Object.values(extraStateRef.current).forEach(val => {
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        Object.values(val).forEach(subVal => {
          total++;
          if (checkValue(subVal)) filled++;
        });
      } else {
        total++;
        if (checkValue(val)) filled++;
      }
    });

    const completion_percentage = total > 0 ? Math.min(100, Math.round((filled / total) * 100)) : 0;
    return { filled, total, completion_percentage };
  }, []);

  // Save function
  const handleSaveDraft = useCallback(async (openModalAfterSave = true) => {
    setIsSaving(true);
    try {
      const payload = {
        formData: formDataRef.current,
        extraState: extraStateRef.current,
        companyName: companyOrArtistName || formDataRef.current.company_name || formDataRef.current.artist_name || '',
        email: contactEmail || formDataRef.current.email || ''
      };

      const metrics = computeMetrics();

      const result = await saveDraft({
        token: activeToken || undefined,
        questionnaire_type: questionnaireType,
        payload,
        current_step: currentStepRef.current,
        total_steps: totalSteps,
        completion_percentage: metrics.completion_percentage,
        completed_fields_count: metrics.filled,
        total_fields_count: metrics.total,
        status: 'in_progress',
        company_or_artist_name: companyOrArtistName || formDataRef.current.company_name || formDataRef.current.artist_name || 'Bozza senza nome',
        contact_email: contactEmail || formDataRef.current.email || ''
      });

      if (result.success && result.token) {
        setActiveToken(result.token);
        const generatedUrl = getResumeUrl(result.token);
        setResumeUrl(generatedUrl);
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSavedTime(timeStr);

        if (openModalAfterSave) {
          setIsModalOpen(true);
        }
      }
      return result;
    } catch (e) {
      console.error("Error saving draft:", e);
      return { success: false, token: '', draft: null as any };
    } finally {
      setIsSaving(false);
    }
  }, [activeToken, questionnaireType, totalSteps, companyOrArtistName, contactEmail, computeMetrics]);

  // Autosave interval (every 30s if activeToken or if form has data)
  useEffect(() => {
    if (autosaveIntervalMs <= 0) return;

    const interval = setInterval(() => {
      // Only autosave silently if activeToken exists or user has entered data
      const metrics = computeMetrics();
      if (activeToken || metrics.filled > 0) {
        handleSaveDraft(false);
      }
    }, autosaveIntervalMs);

    return () => clearInterval(interval);
  }, [autosaveIntervalMs, activeToken, computeMetrics, handleSaveDraft]);

  // Final submit handler
  const handleFinalSubmit = useCallback(async () => {
    if (activeToken) {
      await markDraftCompleted(activeToken);
    }
  }, [activeToken]);

  return {
    activeToken,
    setActiveToken,
    isSaving,
    lastSavedTime,
    isModalOpen,
    setIsModalOpen,
    resumeUrl,
    saveCurrentDraft: handleSaveDraft,
    markDraftAsCompleted: handleFinalSubmit,
    metrics: computeMetrics()
  };
}
