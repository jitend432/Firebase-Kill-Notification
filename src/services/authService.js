import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '591432775381-dsb0lrpg597ibouekr86g0dt2guuja8u.apps.googleusercontent.com',
  offlineAccess: true,
  hostedDomain: '',
  forceCodeForRefreshToken: true,
});

class AuthService {
  async signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      const response = await GoogleSignin.signIn();
      const idToken = response?.data?.idToken || response?.idToken;
      
      if (!idToken) {
        throw new Error('Must specify an idToken or an accessToken.');
      }
      
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return { 
        success: false, 
        error: error.code === 'SIGN_IN_CANCELLED' 
          ? 'Sign in was cancelled' 
          : 'An error occurred during sign in' 
      };
    }
  }

  async signOut() {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      return { success: true };
    } catch (error) {
      console.error('Sign Out Error:', error);
      return { success: false, error: error.message };
    }
  }

  getCurrentUser() {
    return auth().currentUser;
  }

  onAuthStateChanged(callback) {
    return auth().onAuthStateChanged(callback);
  }
}

export default new AuthService();