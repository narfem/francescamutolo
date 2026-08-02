import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface PrivacyConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string | boolean | null;
  id?: string;
  className?: string;
}

export const PrivacyConsentCheckbox: React.FC<PrivacyConsentCheckboxProps> = ({
  checked,
  onChange,
  error,
  id = 'privacy-consent-checkbox',
  className = '',
}) => {
  const handleOpenPrivacyPolicy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('open-privacy-policy'));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start gap-3 select-none">
        <div className="flex items-center h-6 pt-0.5">
          <input
            id={id}
            type="checkbox"
            required
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-required="true"
            aria-invalid={!!error}
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 accent-primary cursor-pointer transition-all shrink-0"
          />
        </div>
        <label htmlFor={id} className="text-sm text-gray-700 leading-snug cursor-pointer font-medium">
          Ho letto l'
          <button
            type="button"
            onClick={handleOpenPrivacyPolicy}
            className="text-primary hover:text-secondary font-bold underline cursor-pointer inline focus:outline-none focus:ring-2 focus:ring-primary/40 rounded px-0.5 transition-colors mx-0.5"
          >
            Informativa Privacy
          </button>
          e acconsento al trattamento dei miei dati personali. <span className="text-primary font-bold">*</span>
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-xs font-semibold animate-in fade-in slide-in-from-top-1 pl-8">
          <ShieldAlert size={15} className="shrink-0" />
          <span>{typeof error === 'string' ? error : "Per procedere è necessario accettare l'Informativa Privacy."}</span>
        </div>
      )}
    </div>
  );
};

export default PrivacyConsentCheckbox;
