import { useState, useEffect, useCallback } from "react";
import { onMessageListener } from "../firebase";
import API from "../api/axios";

/* ── SVG Icons ── */
const IconBell = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
const IconCheck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const IconX = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

/**
 * NotificationToast — listens for foreground Firebase messages
 * and shows an inline action banner at the top of the screen.
 * Also exposes a `trigger(payload)` method via the `onMessage` prop
 * so Dashboard can call it programmatically.
 */
export default function NotificationToast({ onReady, onAction }) {
    const [toast, setToast] = useState(null); // { title, body, actionToken, matchId }
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null); // "joined" | "declined" | "error"

    // Register this component's show function with parent
    const show = useCallback((payload) => {
        const data = payload.data || {};
        const notif = payload.notification || {};
        setToast({
            title: notif.title || "New Match Invitation",
            body: notif.body || "A new match is available.",
            actionToken: data.actionToken,
            matchId: data.matchId,
        });
        setResult(null);
    }, []);

    useEffect(() => {
        if (onReady) onReady(show);
    }, [onReady, show]);

    // Subscribe to foreground FCM messages
    useEffect(() => {
        let active = true;
        const listenNext = () => {
            onMessageListener()
                .then((payload) => {
                    if (!active) return;
                    show(payload);
                    listenNext(); // re-subscribe for next message
                })
                .catch(console.error);
        };
        listenNext();
        return () => { active = false; };
    }, [show]);

    const dismiss = () => {
        setToast(null);
        setResult(null);
    };

    const respond = async (action) => {
        if (!toast?.actionToken) return;
        setLoading(true);
        try {
            await API.post("/api/match/respond", {
                actionToken: toast.actionToken,
                action,
            });
            setResult(action === "YES" ? "joined" : "declined");
            if (onAction) onAction();
            setTimeout(dismiss, 2000);
        } catch (e) {
            setResult("error");
            setTimeout(dismiss, 2500);
        } finally {
            setLoading(false);
        }
    };

    if (!toast) return null;

    return (
        <div style={S.wrap}>
            <div style={S.toast}>
                {/* Header */}
                <div style={S.header}>
                    <div style={S.bellBox}><IconBell /></div>
                    <div style={S.titleArea}>
                        <div style={S.title}>{toast.title}</div>
                        <div style={S.body}>{toast.body}</div>
                    </div>
                    <button style={S.closeBtn} onClick={dismiss} aria-label="Dismiss">
                        <IconX />
                    </button>
                </div>

                {/* Result feedback */}
                {result === "joined" && <div style={S.feedbackGreen}>You have joined the match!</div>}
                {result === "declined" && <div style={S.feedbackGray}>Invitation declined.</div>}
                {result === "error" && <div style={S.feedbackRed}>Something went wrong. Try joining from the dashboard.</div>}

                {/* Actions */}
                {!result && (
                    <div style={S.actions}>
                        <button style={S.btnDecline} onClick={() => respond("NO")} disabled={loading}>
                            Decline
                        </button>
                        <button style={S.btnJoin} onClick={() => respond("YES")} disabled={loading}>
                            <IconCheck /> {loading ? "Joining…" : "Join Match"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const S = {
    wrap: {
        position: "fixed", top: "80px", right: "20px", zIndex: 999,
        maxWidth: "380px", width: "calc(100vw - 40px)",
        animation: "fadeUp 0.3s ease both",
    },
    toast: {
        background: "#fff", borderRadius: "14px",
        border: "1px solid #e8deff",
        boxShadow: "0 8px 30px rgba(124,58,237,0.18), 0 2px 8px rgba(0,0,0,0.06)",
        padding: "18px", display: "flex", flexDirection: "column", gap: "14px",
    },
    header: { display: "flex", alignItems: "flex-start", gap: "12px" },
    bellBox: {
        width: "38px", height: "38px", flexShrink: 0,
        background: "#f3e8ff", borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#7c3aed",
    },
    titleArea: { flex: 1 },
    title: { fontSize: "14px", fontWeight: 700, color: "#1e1b2e", marginBottom: "3px" },
    body: { fontSize: "13px", color: "#4b4569", lineHeight: 1.5 },
    closeBtn: {
        background: "none", border: "none", cursor: "pointer",
        color: "#9ca3af", padding: "4px", flexShrink: 0,
        display: "flex", alignItems: "center",
    },
    actions: { display: "flex", gap: "10px" },
    btnJoin: {
        flex: 2, padding: "11px", display: "flex", alignItems: "center",
        justifyContent: "center", gap: "6px",
        background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff",
        border: "none", fontFamily: "inherit", fontSize: "13px", fontWeight: 700,
        borderRadius: "8px", cursor: "pointer",
    },
    btnDecline: {
        flex: 1, padding: "11px",
        background: "#f9fafb", border: "1px solid #e5e7eb",
        color: "#6b7280", fontFamily: "inherit", fontSize: "13px", fontWeight: 600,
        borderRadius: "8px", cursor: "pointer",
    },
    feedbackGreen: {
        padding: "10px 12px", background: "#f0fdf4",
        border: "1px solid #86efac", color: "#166534",
        borderRadius: "8px", fontSize: "13px", fontWeight: 600, textAlign: "center",
    },
    feedbackGray: {
        padding: "10px 12px", background: "#f9fafb",
        border: "1px solid #e5e7eb", color: "#6b7280",
        borderRadius: "8px", fontSize: "13px", fontWeight: 600, textAlign: "center",
    },
    feedbackRed: {
        padding: "10px 12px", background: "#fff5f5",
        border: "1px solid #fca5a5", color: "#dc2626",
        borderRadius: "8px", fontSize: "13px", fontWeight: 500, textAlign: "center",
    },
};
