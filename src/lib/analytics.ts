type LeadSource = 'contact_form' | 'phone_click'

/**
 * Reports a lead to Google Analytics. `gtag` only exists once the tag has loaded,
 * so nothing is sent for visitors who refused analytics.
 */
export function trackLead(leadSource: LeadSource) {
  const {gtag} = window as Window & {gtag?: (...args: unknown[]) => void}
  gtag?.('event', 'generate_lead', {lead_source: leadSource})
}
