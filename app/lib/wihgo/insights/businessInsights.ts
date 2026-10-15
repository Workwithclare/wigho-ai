import { BusinessInsightItem, BusinessContextRelation, PlatformId } from '../types';

export const INITIAL_BUSINESS_INSIGHTS: BusinessInsightItem[] = [];

export const INITIAL_BUSINESS_CONTEXT_RELATIONS: BusinessContextRelation[] = [];

const INSIGHTS_STORAGE_KEY = 'wihgo_business_insights_v1';

export class BusinessInsightsService {
  public static getInsights(): BusinessInsightItem[] {
    try {
      const data = localStorage.getItem(INSIGHTS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load insights:', e);
    }
    return INITIAL_BUSINESS_INSIGHTS;
  }

  public static getContextRelations(): BusinessContextRelation[] {
    return INITIAL_BUSINESS_CONTEXT_RELATIONS;
  }

  public static getRelationForCustomer(nameOrHandle: string): BusinessContextRelation | undefined {
    const q = nameOrHandle.toLowerCase();
    return INITIAL_BUSINESS_CONTEXT_RELATIONS.find(r => 
      r.customerName.toLowerCase().includes(q) ||
      r.companyName.toLowerCase().includes(q) ||
      (r.handle && r.handle.toLowerCase().includes(q))
    );
  }
}
