
import { CalculationInput, CalculationResult, EngineCommandType, EngineEventType } from './types';
import { Bus } from './bus';

// Constants
const G = 6.67430e-11; // Gravitational Constant
const C = 299792458; // Speed of Light

export class SchwarzschildEngine {
  constructor() {
    this.init();
  }

  private init() {
    Bus.subscribe(EngineCommandType.CALCULATE_SCHWARZSCHILD, (input: CalculationInput) => {
      this.calculate(input);
    });
    
    Bus.subscribe(EngineCommandType.RESET_ENGINE, () => {
      Bus.publish(EngineEventType.LOG_MESSAGE, "Engine system reset.");
    });
  }

  private calculate(input: CalculationInput) {
    const { mass, radius } = input;
    
    try {
      if (mass <= 0 || radius <= 0) {
        throw new Error("Mass and radius must be greater than zero.");
      }

      // rs = 2GM / c^2
      const rs = (2 * G * mass) / Math.pow(C, 2);
      
      // L-Factor = sqrt(1 - rs/r)
      let lFactor = 0;
      let isInsideHorizon = false;

      if (radius > rs) {
        lFactor = Math.sqrt(1 - (rs / radius));
      } else {
        isInsideHorizon = true;
        lFactor = 0; // Singular or complex at r <= rs
      }

      const result: CalculationResult = {
        schwarzschildRadius: rs,
        lFactor: lFactor,
        isInsideHorizon: isInsideHorizon,
        timestamp: Date.now()
      };

      Bus.publish(EngineEventType.CALCULATION_SUCCESS, result);
      Bus.publish(EngineEventType.LOG_MESSAGE, `Calculated Schwarzschild params for M=${mass.toExponential(2)}`);
    } catch (err: any) {
      Bus.publish(EngineEventType.CALCULATION_ERROR, err.message);
    }
  }
}

// Singleton for core logic
export const engineInstance = new SchwarzschildEngine();
