// Dependencies:
import { IneedaApi } from './ineeda-api';
import { IneedaOptions } from './ineeda-options';
import { factory, instance } from './ineeda';

let ineeda = <IneedaApi>instance;
ineeda.factory = factory;

export default ineeda;
