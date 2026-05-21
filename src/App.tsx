import Otp from './Otp';

const mockEmit = (event: string, detail: Record<string, unknown>) => {
  console.log('[mf-auth dev] Event:', event, detail);
};

export default function App() {
  return <Otp emit={mockEmit} />;
}
