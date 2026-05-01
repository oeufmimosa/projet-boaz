import type { ComponentType } from "react";

import { IllusHouse } from "./IllusHouse";
import { IllusApartment } from "./IllusApartment";

import { IllusOwnerLiving } from "./IllusOwnerLiving";
import { IllusOwnerRenting } from "./IllusOwnerRenting";
import { IllusTenant } from "./IllusTenant";

import { IllusInsulationAttic } from "./IllusInsulationAttic";
import { IllusInsulationWalls } from "./IllusInsulationWalls";
import { IllusInsulationFloor } from "./IllusInsulationFloor";
import { IllusHeatPumpAirWater } from "./IllusHeatPumpAirWater";
import { IllusHeatPumpAirAir } from "./IllusHeatPumpAirAir";
import { IllusBoiler } from "./IllusBoiler";
import { IllusSolar } from "./IllusSolar";
import { IllusWindows } from "./IllusWindows";
import { IllusVMC } from "./IllusVMC";
import { IllusAudit } from "./IllusAudit";

import { IllusHeatingGas } from "./IllusHeatingGas";
import { IllusHeatingElectric } from "./IllusHeatingElectric";
import { IllusHeatingFuel } from "./IllusHeatingFuel";
import { IllusHeatingWood } from "./IllusHeatingWood";
import { IllusHeatingPump } from "./IllusHeatingPump";
import { IllusHeatingOther } from "./IllusHeatingOther";

import { IllusHousehold1 } from "./IllusHousehold1";
import { IllusHousehold2 } from "./IllusHousehold2";
import { IllusHousehold3 } from "./IllusHousehold3";
import { IllusHousehold4 } from "./IllusHousehold4";
import { IllusHousehold5plus } from "./IllusHousehold5plus";

import { IllusSuccess } from "./IllusSuccess";

export interface IllustrationProps {
  className?: string;
  size?: number;
}

/**
 * Registre des illustrations disponibles. Le nom (clé en kebab-case) est
 * stocké côté admin dans `option.illustrationKey` ou `step.illustrationKey`.
 */
export const ILLUSTRATIONS: Record<string, ComponentType<IllustrationProps>> = {
  // Logement
  house: IllusHouse,
  apartment: IllusApartment,
  // Statut
  "owner-living": IllusOwnerLiving,
  "owner-renting": IllusOwnerRenting,
  tenant: IllusTenant,
  // Travaux
  "insulation-attic": IllusInsulationAttic,
  "insulation-walls": IllusInsulationWalls,
  "insulation-floor": IllusInsulationFloor,
  "heat-pump-air-water": IllusHeatPumpAirWater,
  "heat-pump-air-air": IllusHeatPumpAirAir,
  boiler: IllusBoiler,
  solar: IllusSolar,
  windows: IllusWindows,
  vmc: IllusVMC,
  audit: IllusAudit,
  // Chauffage actuel
  "heating-gas": IllusHeatingGas,
  "heating-electric": IllusHeatingElectric,
  "heating-fuel": IllusHeatingFuel,
  "heating-wood": IllusHeatingWood,
  "heating-pump": IllusHeatingPump,
  "heating-other": IllusHeatingOther,
  // Foyer
  "household-1": IllusHousehold1,
  "household-2": IllusHousehold2,
  "household-3": IllusHousehold3,
  "household-4": IllusHousehold4,
  "household-5plus": IllusHousehold5plus,
  // Succès
  success: IllusSuccess,
};

export type IllustrationKey = keyof typeof ILLUSTRATIONS;

export {
  IllusHouse, IllusApartment,
  IllusOwnerLiving, IllusOwnerRenting, IllusTenant,
  IllusInsulationAttic, IllusInsulationWalls, IllusInsulationFloor,
  IllusHeatPumpAirWater, IllusHeatPumpAirAir, IllusBoiler, IllusSolar,
  IllusWindows, IllusVMC, IllusAudit,
  IllusHeatingGas, IllusHeatingElectric, IllusHeatingFuel, IllusHeatingWood,
  IllusHeatingPump, IllusHeatingOther,
  IllusHousehold1, IllusHousehold2, IllusHousehold3, IllusHousehold4, IllusHousehold5plus,
  IllusSuccess,
};
