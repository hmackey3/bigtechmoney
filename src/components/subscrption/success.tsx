import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SubscriptionSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      // You can verify the session if needed
      setTimeout(() => {
        navigate("/subscription");
      }, 5000);
    }
  }, [sessionId, navigate]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <div className="text-green-600 text-5xl mb-4">✓</div>
      <h1 className="text-2xl font-bold mb-4">Subscription Successful!</h1>
      <p className="mb-4">
        Thank you for subscribing. Your account has been activated.
      </p>
      <p className="text-sm text-gray-600">
        You will be redirected to your subscription page in a few seconds...
      </p>
    </div>
  );
};

export default SubscriptionSuccess;
