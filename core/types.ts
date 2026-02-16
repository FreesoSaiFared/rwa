
export enum EngineCommandType {
  CALCULATE_SCHWARZSCHILD = 'CALCULATE_SCHWARZSCHILD',
  EXPLAIN_PHYSICS = 'EXPLAIN_PHYSICS',
  RESET_ENGINE = 'RESET_ENGINE'
}

export enum EngineEventType {
  CALCULATION_SUCCESS = 'CALCULATION_SUCCESS',
  CALCULATION_ERROR = 'CALCULATION_ERROR',
  AI_EXPLANATION_READY = 'AI_EXPLANATION_READY',
  LOG_MESSAGE = 'LOG_MESSAGE'
}

export interface CalculationInput {
  mass: number; // in kg
  radius: number; // in meters
}

export interface CalculationResult {
  schwarzschildRadius: number;
  lFactor: number; // Relativistic time dilation factor
  isInsideHorizon: boolean;
  timestamp: number;
}

export type BusHandler = (data: any) => void;
