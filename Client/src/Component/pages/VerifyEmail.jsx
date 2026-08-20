// client/src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { verifyEmailApi } from "../../api/authApi";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmailApi(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0d0e12] flex flex-col items-center justify-center px-6 text-center">
      {status === "verifying" && (
        <>
          <Loader2 size={40} className="text-[#D4A34E] animate-spin" />
          <p className="text-gray-400 text-sm mt-4">Verifying your email...</p>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle size={48} className="text-green-400" />
          <h1 className="text-xl text-white mt-4">Email Verified</h1>
          <p className="text-gray-400 text-sm mt-2">Your account is fully set up.</p>
        </>
      )}
      {status === "error" && (
        <>
          <XCircle size={48} className="text-red-400" />
          <h1 className="text-xl text-white mt-4">Verification Failed</h1>
          <p className="text-gray-400 text-sm mt-2">{message}</p>
        </>
      )}
      <Link to="/" className="mt-8 px-6 py-3 bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm rounded">
        Go to Homepage
      </Link>
    </div>
  );
}

