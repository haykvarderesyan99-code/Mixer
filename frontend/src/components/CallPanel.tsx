import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { supabase, supabaseConfigured } from "../lib/supabase";

type CallPanelProps = {
  mode: "Voice" | "Video";
  room: string;
  contactName: string;
  onEnd: () => void;
};

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4002";

export default function CallPanel({ mode, room, contactName, onEnd }: CallPanelProps) {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peer = useRef<RTCPeerConnection | null>(null);
  const socket = useRef<Socket | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState("Checking camera and microphone...");
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(mode === "Voice");

  useEffect(() => {
    let cancelled = false;

    const setupLocalMedia = async () => {
      const token = supabaseConfigured ? (await supabase.auth.getSession()).data.session?.access_token : localStorage.getItem("social-network-token");
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (!cancelled) setStatus("This browser does not support live media for calls.");
        return;
      }

      try {
        const media = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: mode === "Video",
        });

        if (cancelled) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }

        stream.current = media;
        if (localVideo.current) localVideo.current.srcObject = media;
        if (!cancelled) setStatus(`Ready for ${mode.toLowerCase()} call with ${contactName}`);

        if (token) {
          const connection = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
          });
          peer.current = connection;
          const client = io(apiUrl, { auth: { token }, autoConnect: false });
          socket.current = client;

          const sendOffer = async () => {
            const offer = await connection.createOffer();
            await connection.setLocalDescription(offer);
            client.emit("call:offer", { room, offer });
            setStatus(`Calling ${contactName}...`);
          };

          client.on("connect", () => {
            client.emit("call:join", { room });
            client.emit("call:invite", { room, mode });
          });
          client.on("call:peer-joined", () => void sendOffer());
          client.on("connect_error", () => setStatus("Call signaling is unavailable. Local preview still works."));
          client.on("call:offer", async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
            await connection.setRemoteDescription(offer);
            const answer = await connection.createAnswer();
            await connection.setLocalDescription(answer);
            client.emit("call:answer", { room, answer });
            setStatus(`${contactName} joined the call`);
          });
          client.on("call:answer", ({ answer }: { answer: RTCSessionDescriptionInit }) => {
            void connection.setRemoteDescription(answer);
            setStatus(`${contactName} joined the call`);
          });
          client.on("call:ice-candidate", ({ candidate }: { candidate: RTCIceCandidateInit }) => {
            void connection.addIceCandidate(candidate);
          });
          client.on("call:hangup", onEnd);
          connection.onicecandidate = (event) => {
            if (event.candidate) client.emit("call:ice-candidate", { room, candidate: event.candidate });
          };
          connection.ontrack = (event) => {
            if (remoteVideo.current) remoteVideo.current.srcObject = event.streams[0];
          };

          media.getTracks().forEach((track) => connection.addTrack(track, media));
          client.connect();
        } else {
          setStatus(`Local demo call ready: ${mode.toLowerCase()} mode is active for ${contactName}.`);
        }
      } catch {
        if (!cancelled) setStatus("Microphone or camera permission was denied. You can still keep the panel open.");
      }
    };

    void setupLocalMedia();

    return () => {
      cancelled = true;
      socket.current?.emit("call:hangup", { room });
      socket.current?.emit("call:leave", { room });
      socket.current?.disconnect();
      peer.current?.close();
      stream.current?.getTracks().forEach((track) => track.stop());
      stream.current = null;
    };
  }, [contactName, mode, onEnd, room]);

  const endCall = () => {
    socket.current?.emit("call:hangup", { room });
    onEnd();
  };

  return (
    <section className="rounded-[28px] border border-emerald-400/30 bg-slate-950 p-5 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">{mode} call</p>
          <h2 className="mt-1 text-xl font-semibold text-white">{contactName}</h2>
          <p className="mt-1 text-sm text-slate-400">{status}</p>
        </div>
        <button type="button" onClick={endCall} className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white">End call</button>
      </div>
      {mode === "Video" ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <video ref={localVideo} autoPlay muted playsInline className="aspect-video w-full rounded-2xl bg-slate-900 object-cover" />
          <div className="flex aspect-video items-center justify-center rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 text-sm text-slate-300">
            <video ref={remoteVideo} autoPlay playsInline className="h-full w-full rounded-2xl object-cover" />
          </div>
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => {
          stream.current?.getAudioTracks().forEach((track) => {
            track.enabled = muted;
          });
          setMuted((value) => !value);
        }} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">{muted ? "Unmute" : "Mute"}</button>
        {mode === "Video" ? (
          <button type="button" onClick={() => {
            stream.current?.getVideoTracks().forEach((track) => {
              track.enabled = cameraOff;
            });
            setCameraOff((value) => !value);
          }} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">{cameraOff ? "Camera on" : "Camera off"}</button>
        ) : null}
      </div>
    </section>
  );
}
