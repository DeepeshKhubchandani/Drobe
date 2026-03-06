import React, { useState } from "react";
import logoImg from "../../../assets/logo.png";

const plannedOutfits = [
  {
    date: "Mar 3",
    day: "Mon",
    image: "https://images.unsplash.com/photo-1633972767447-5098f0322a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMGtuaXQlMjBzd2VhdGVyJTIwY2xvdGhpbmclMjBpdGVtJTIwZmxhdCUyMGxheXxlbnwxfHx8fDE3NzI3MzA0NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    date: "Mar 4",
    day: "Tue",
    image: "https://images.unsplash.com/photo-1633972767447-5098f0322a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMGtuaXQlMjBzd2VhdGVyJTIwY2xvdGhpbmclMjBpdGVtJTIwZmxhdCUyMGxheXxlbnwxfHx8fDE3NzI3MzA0NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    date: "Mar 5",
    day: "Wed",
    image: "https://images.unsplash.com/photo-1680254418556-3980c19d4304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNuZWFrZXJzJTIwc2hvZXMlMjBtaW5pbWFsfGVufDF8fHx8MTc3MjYyNTEzNnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Client Meeting",
    date: "Mon, Mar 3",
    time: "10:00 AM",
    image: "https://images.unsplash.com/photo-1633972767447-5098f0322a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMGtuaXQlMjBzd2VhdGVyJTIwY2xvdGhpbmclMjBpdGVtJTIwZmxhdCUyMGxheXxlbnwxfHx8fDE3NzI3MzA0NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    title: "Team Lunch",
    date: "Tue, Mar 4",
    time: "1:00 PM",
    image: "https://images.unsplash.com/photo-1633972767447-5098f0322a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMGtuaXQlMjBzd2VhdGVyJTIwY2xvdGhpbmclMjBpdGVtJTIwZmxhdCUyMGxheXxlbnwxfHx8fDE3NzI3MzA0NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

interface OutfitPlannerScreenProps {
  onNavigate: (screen: string) => void;
}

export function OutfitPlannerScreen({ onNavigate }: OutfitPlannerScreenProps) {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "#F7F5F2", fontFamily: "'DM Sans', sans-serif" }}
    >
      <div style={{ height: 44 }} />

      {/* Header */}
      <div className="px-6 py-4">
        <img src={logoImg} alt="Drobe" style={{ height: 48, width: "auto", marginBottom: 12 }} />
        <h1 style={{ fontSize: 28, fontWeight: 400, color: "#1A1A1A", fontFamily: "'Playfair Display', serif", lineHeight: 1.2, marginBottom: 4 }}>
          Outfit Planner
        </h1>
        <p style={{ fontSize: 14, color: "#A0917E" }}>Plan ahead with confidence</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6" style={{ paddingBottom: 100 }}>
        {/* This Week */}
        <div className="mb-6">
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A", marginBottom: 14 }}>This Week</h2>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {plannedOutfits.map((outfit) => (
              <div
                key={outfit.day}
                className="flex-shrink-0"
                style={{ width: 140 }}
              >
                <div style={{ background: "#fff", borderRadius: 16, padding: 12, border: "1px solid #F0EDE8" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p style={{ fontSize: 11, color: "#A0917E", marginBottom: 2 }}>{outfit.date}</p>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>{outfit.day}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(`week-${outfit.day}`)}
                      style={{
                        background: favorites.includes(`week-${outfit.day}`) ? "#FFF9ED" : "#F7F5F2",
                        border: favorites.includes(`week-${outfit.day}`) ? "1px solid #C9A96E" : "1px solid #E8E3DC",
                        borderRadius: 8,
                        padding: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill={favorites.includes(`week-${outfit.day}`) ? "#C9A96E" : "none"}>
                        <path d="M8 2.5L9.5 6.5H13.5L10.5 9L11.5 13L8 10.5L4.5 13L5.5 9L2.5 6.5H6.5L8 2.5Z" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>
                    <img src={outfit.image} alt={`${outfit.day} outfit`} className="w-full h-full object-cover" />
                  </div>
                  <button
                    style={{
                      width: "100%",
                      background: "#F7F5F2",
                      borderRadius: 8,
                      padding: "6px 0",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#6B5E4E",
                      border: "1px solid #E8E3DC",
                    }}
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A" }}>Upcoming Events</h2>
            <button
              onClick={() => setShowAddEvent(true)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "#1A1A1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3V13M3 8H13" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3"
                style={{ background: "#fff", borderRadius: 16, padding: 14, border: "1px solid #F0EDE8" }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A", marginBottom: 2 }}>{event.title}</h3>
                  <p style={{ fontSize: 13, color: "#A0917E" }}>
                    {event.date} · {event.time}
                  </p>
                </div>
                <button
                  onClick={() => toggleFavorite(`event-${event.id}`)}
                  style={{
                    background: favorites.includes(`event-${event.id}`) ? "#FFF9ED" : "#F7F5F2",
                    border: favorites.includes(`event-${event.id}`) ? "1px solid #C9A96E" : "1px solid #E8E3DC",
                    borderRadius: 10,
                    padding: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    marginRight: 8,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill={favorites.includes(`event-${event.id}`) ? "#C9A96E" : "none"}>
                    <path d="M8 2.5L9.5 6.5H13.5L10.5 9L11.5 13L8 10.5L4.5 13L5.5 9L2.5 6.5H6.5L8 2.5Z" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="#C4B8AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-end",
            zIndex: 50,
          }}
          onClick={() => setShowAddEvent(false)}
        >
          <div
            style={{
              width: "100%",
              background: "#fff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: "24px 20px 40px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1A1A1A", fontFamily: "'Playfair Display', serif" }}>
                Add Event
              </h2>
              <button
                onClick={() => setShowAddEvent(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "#F7F5F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2L12 12M2 12L12 2" stroke="#6B5E4E" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4">
              <div>
                <label style={{ fontSize: 12, color: "#6B5E4E", fontWeight: 600, display: "block", marginBottom: 8 }}>
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Client Meeting"
                  style={{
                    width: "100%",
                    background: "#F7F5F2",
                    border: "1px solid #E8E3DC",
                    borderRadius: 12,
                    padding: "12px 14px",
                    fontSize: 14,
                    color: "#1A1A1A",
                    outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label style={{ fontSize: 12, color: "#6B5E4E", fontWeight: 600, display: "block", marginBottom: 8 }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#F7F5F2",
                      border: "1px solid #E8E3DC",
                      borderRadius: 12,
                      padding: "12px 14px",
                      fontSize: 14,
                      color: "#1A1A1A",
                      outline: "none",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>

                <div className="flex-1">
                  <label style={{ fontSize: 12, color: "#6B5E4E", fontWeight: 600, display: "block", marginBottom: 8 }}>
                    Time
                  </label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#F7F5F2",
                      border: "1px solid #E8E3DC",
                      borderRadius: 12,
                      padding: "12px 14px",
                      fontSize: 14,
                      color: "#1A1A1A",
                      outline: "none",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  // Handle save event logic here
                  setShowAddEvent(false);
                  setEventTitle("");
                  setEventDate("");
                  setEventTime("");
                }}
                style={{
                  width: "100%",
                  background: eventTitle && eventDate && eventTime ? "#1A1A1A" : "#E8E3DC",
                  borderRadius: 14,
                  padding: "14px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: eventTitle && eventDate && eventTime ? "#fff" : "#A0917E",
                  border: "none",
                  cursor: eventTitle && eventDate && eventTime ? "pointer" : "default",
                  marginTop: 8,
                }}
                disabled={!eventTitle || !eventDate || !eventTime}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
