/// <reference path="./_references.d.ts" />
'use strict';

// Interfaces:
import IFinder from './lib/IFinder';

// Dependencies:
import Finder from './lib/Finder';
import Ineeda from './lib/Ineeda';

let finder: IFinder = new Finder();
finder.findTypes();

export default Ineeda;
