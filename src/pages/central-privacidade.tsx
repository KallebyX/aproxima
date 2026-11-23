import Head from 'next/head';
import Header from './Header';
import Footer from '../components/Footer';
import LGPDPrivacyCenter from '../components/LGPDPrivacyCenter';

export default function CentralPrivacidade() {
  return <><Head><title>Central de Privacidade | Aproxima</title></Head><Header /><main id="main-content"><LGPDPrivacyCenter /></main><Footer /></>;
}
