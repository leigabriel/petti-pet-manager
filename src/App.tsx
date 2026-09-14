import { Navigate, Route } from 'react-router-dom';
import {
  createAnimation,
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  type AnimationBuilder,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import ExitConfirmModal from './components/ExitConfirmModal';
import { useExitConfirmation } from './hooks/useExitConfirmation';
import About from './pages/About';
import Home from './pages/Home';
import Pets from './pages/Pets';
import Welcome from './pages/Welcome';

import './theme/variables.css';

const fadeTransition: AnimationBuilder = (_baseElement, options) => {
  const animation = createAnimation().duration(180).easing('ease-in-out');

  if (options.enteringEl) {
    animation.addAnimation(
      createAnimation()
        .addElement(options.enteringEl)
        .beforeRemoveClass('ion-page-invisible')
        .fromTo('opacity', '0', '1'),
    );
  }

  if (options.leavingEl) {
    animation.addAnimation(
      createAnimation().addElement(options.leavingEl).fromTo('opacity', '1', '0'),
    );
  }

  return animation;
};

setupIonicReact({ navAnimation: fadeTransition });

const App: React.FC = () => {
  const { showConfirm, confirmExit, cancelExit } = useExitConfirmation();

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </IonRouterOutlet>
      </IonReactRouter>
      <ExitConfirmModal
        isOpen={showConfirm}
        onConfirm={confirmExit}
        onCancel={cancelExit}
      />
    </IonApp>
  );
};

export default App;
