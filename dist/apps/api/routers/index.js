"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("../trpc/trpc");
const auth_1 = require("./auth");
const patients_1 = require("./patients");
const practitioners_1 = require("./practitioners");
const locations_1 = require("./locations");
const slots_1 = require("./slots");
const appointments_1 = require("./appointments");
const availability_1 = require("./availability");
exports.appRouter = (0, trpc_1.router)({
    auth: auth_1.authRouter,
    patients: patients_1.patientsRouter,
    practitioners: practitioners_1.practitionersRouter,
    locations: locations_1.locationsRouter,
    slots: slots_1.slotsRouter,
    availability: availability_1.availabilityRouter,
    appointments: appointments_1.appointmentsRouter,
});
//# sourceMappingURL=index.js.map