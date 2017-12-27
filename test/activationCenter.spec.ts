import * as assert from 'assert';
import { IMock, Mock, It, Times } from 'typemoq';
import { Activator } from '../src/activator';
import { ActivationCenter } from '../src/activationCenter';
import { Step, StepActivationReference } from 'continui-step';

describe('The Activation Center', () => {

  it('Should set as current activator the one provided on useActivator function when is called',
     () => {
       const activatorMock: IMock<Activator> = Mock.ofType<Activator>();
       const activationCenter: ActivationCenter = new ActivationCenter();

       activationCenter.useActivator(activatorMock.object);

       assert.equal(activationCenter.currentActivator, activatorMock.object);
     });

  it('Should set as current activator the default activator when the function useDefaultActivator' +
     'is called',
     () => {
       const activationCenter: ActivationCenter = new ActivationCenter();

       activationCenter.useDefaultActivator();

       assert.equal(activationCenter.currentActivator, activationCenter.defaultActivator);
     });


  it('Should throw and error when an step activation definition is provided without an step',
     () => {
       const activationCenter: ActivationCenter = new ActivationCenter();

       assert.throws(() => {
         activationCenter.addStepActivationDefinitions({
           identifier: 'test',
           step: null,
           activationReferences: [],
         });
       });
     });

  it('Should throw and error when exist repetitive step activation definition step identifiers',
     () => {
       const activationCenter: ActivationCenter = new ActivationCenter();

       assert.throws(() => {
         activationCenter.addStepActivationDefinitions(...[{
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

  it('Should call the activator register reference function 6 times, because 6 references are ' +
     'been provided.',
     () => {
       const activatorMock: IMock<Activator> = Mock.ofType<Activator>();
       const activationCenter: ActivationCenter = new ActivationCenter();
       const activatorReference: StepActivationReference = { alias: 'reference 1', target: {} };

       activationCenter.useActivator(activatorMock.object);
       activationCenter.addActivatorReferences(activatorReference); // 1
       activationCenter.addActivatorReferences(activatorReference); // 2

       activationCenter.addStepActivationDefinitions({
         identifier: 'test',
         step() {},// 3 A reference is created for the step
         activationReferences: [
           activatorReference, // 4
           activatorReference, // 5
           activatorReference, // 6
         ],
       });

       activatorMock.verify(activator => activator.registerReference(It.isAny()), Times.exactly(6));
     });

});
