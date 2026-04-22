import {
  guideCategories,
  guideTerms,
  type GuideCategory,
  type GuideTerm,
} from "@/data/guidesContent";

export function getTermsByCategory(category: GuideCategory): GuideTerm[] {
  return guideTerms.filter((term) => term.category === category);
}

export function getGroupedTerms() {
  return guideCategories.map((category) => ({
    category,
    terms: getTermsByCategory(category.id),
  }));
}

export function getRelatedTermNames(term: GuideTerm): string[] {
  if (!term.relatedTerms?.length) return [];

  return term.relatedTerms
    .map((relatedId) => {
      const match = guideTerms.find(
        (entry) => entry.id === relatedId || entry.slug === relatedId
      );
      return match?.term;
    })
    .filter(Boolean) as string[];
}

export function getCategoryLabel(categoryId: GuideCategory): string {
  return guideCategories.find((category) => category.id === categoryId)?.label ?? categoryId;
}