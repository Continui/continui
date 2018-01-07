import * as assert from 'assert';
import { IMock, Mock, It, Times } from 'typemoq';
import { Activator } from '../src/activator';
import { ActivationCenter } from '../src/activationCenter';
import { Step, StepActivationReference } from 'continui-step';
import { BuildInActivationCenter } from '../src/build-in/buildInActivationCenter';

describe('The Activation Center', () => {

  it('Should throw and error when an step activation definition is provided without an step',
     () => {
       const activationCenter: ActivationCenter = new BuildInActivationCenter();

       assert.throws(() => {
         activationCenter.loadStepActivationDefinitions({
           identifier: 'test',
           step: null,
           activationReferences: [],
         });
       });
     });

  it('Should throw and error when exist repetitive step activation definition step identifiers',
     () => {
       const activationCenter: ActivationCenter = new BuildInActivationCenter();

       assert.throws(() => {
         activationCenter.loadStepActivationDefinitions(...[{
           identifier: 'test',
           step () {},
           activationReferences: [],
         },
         {
           identifier: 'test',
           step () {},
           activationReferences: [],
         }]);
       });
     });

// it('Should call the activator register reference function 6 times, because 6 references are ' +
//    'been provided.',
//    () => {
//      const activatorMock: IMock<Activator> = Mock.ofType<Activator>();
//      const activationCenter: ActivationCenter = new ActivationCenter();
//      const activatorReference: StepActivationReference = { alias: 'reference 1', target: {} };


//      activationCenter.addStepActivationDefinitions({
//        identifier: 'test',
//        step() {},// 1 A reference is created for the step
//        activationReferences: [
//          activatorReference, // 2
//          activatorReference, // 3
//          activatorReference, // 4
//        ],
//      });

//      activatorMock.verify(activator => activator
// .registerReference(It.isAny()), Times.exactly(4));
//    });

});
