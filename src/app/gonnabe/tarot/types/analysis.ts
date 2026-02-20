import { TarotCardsApiItem } from './cards';

export interface TarotAnalysisData {
  // Daily
  messageToday?: string;
  todayFlow?: string;
  emotionalState?: string;
  mindfulReminder?: string;
  quietMessage?: string;

  // Weekly
  arcanaOfWeek?: string;
  mirrorCard?: string;
  windsOfChange?: string;
  shadowAndChallenge?: string;
  threadOfStory?: string;
  tarotsWhisper?: string;

  // Monthly
  monthlyTheme?: string;
  opportunitiesResources?: string;
  challengesObstacles?: string;
  guidanceAttitude?: string;
  growthOutcome?: string;
  monthlySummary?: string;

  // Common
  keywords?: string[];
  cardKeywords?: string[];
}

export interface TarotAnalysisResult {
  analysis: TarotAnalysisData;
  selectedCards: TarotCardsApiItem[];
}
