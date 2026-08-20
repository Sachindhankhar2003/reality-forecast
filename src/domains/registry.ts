import { DomainPlugin, ForecastDomain } from '@/types/domain';
import { travelDomain } from './travel';
import { interviewDomain } from './interview';
import { hotelDomain } from './hotel';
import { examDomain } from './exam';
import { meetingDomain } from './meeting';
import { genericDomain } from './generic';

const domainRegistry = new Map<ForecastDomain, DomainPlugin>();

export function registerDomain(domain: DomainPlugin): void {
  domainRegistry.set(domain.id, domain);
}

// Initial registrations
registerDomain(travelDomain);
registerDomain(interviewDomain);
registerDomain(hotelDomain);
registerDomain(examDomain);
registerDomain(meetingDomain);
registerDomain(genericDomain);

export function getDomainPlugin(domainId: ForecastDomain): DomainPlugin {
  const plugin = domainRegistry.get(domainId);
  if (!plugin) {
    return genericDomain;
  }
  return plugin;
}

export function getAllDomains(): DomainPlugin[] {
  return Array.from(domainRegistry.values());
}
