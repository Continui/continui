import * as assert from 'assert';
import { IMock, Mock, It, Times } from 'typemoq';
import { Activator } from '../src/activator';
import { ActivationCenter } from '../src/activationCenter';
import { Step } from '../src/step';
import { ActivatorReference } from '../src/activatorReference';

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
           step: null,
           activationReferences: [],
         });
       });
     });

  it('Should throw and error when exist repetitive step activation definition step identifiers',
     () => {
       const mainStepMock: IMock<Step<any>> = Mock.ofType<Step<any>>();
       mainStepMock.setup(step => step.identifier).returns(() => 'same-identifier');

       const activationCenter: ActivationCenter = new ActivationCenter();
        

       assert.throws(() => {
         activationCenter.addStepActivationDefinitions(...[{
           step: mainStepMock.object,
           activationReferences: [],
         },
         {
           step: mainStepMock.object,
           activationReferences: [],
         }]);
       });
     });

  it('Should call the activator register reference function 6 times, because 6 references are ' +
     'been provided.',
     () => {
       const activatorMock: IMock<Activator> = Mock.ofType<Activator>();
       const stepMock: IMock<Step<any>> = Mock.ofType<Step<any>>();
       const activationCenter: ActivationCenter = new ActivationCenter();
       const activatorReference: ActivatorReference = { alias: 'reference 1', target: {} };

       activationCenter.useActivator(activatorMock.object);
       activationCenter.addActivatorReferences(activatorReference); // 1
       activationCenter.addActivatorReferences(activatorReference); // 2

       activationCenter.addStepActivationDefinitions({
         step: stepMock.object,// 3 A reference is created for the step
         activationReferences: [
           activatorReference,// 4
           activatorReference,// 5
           activatorReference, // 6
         ],
       });

       activatorMock.verify(activator => activator.registerReference(It.isAny()), Times.exactly(6));
     });

});
