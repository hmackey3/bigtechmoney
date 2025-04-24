import { useNavigate } from "react-router-dom";

const SubscriptionCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-2xl font-bold mb-4">Subscription Canceled</h1>
      <p className="mb-4">Your subscription process was canceled.</p>
      <button
        onClick={() => navigate("/subscription")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Back to Subscription Page
      </button>
    </div>
  );
};

export default SubscriptionCancel;
