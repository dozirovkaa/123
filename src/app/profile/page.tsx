"use client";

import { useSession } from "next-auth/react";
import { useLocalization } from "@/providers/LocalizationProvider";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Script from "next/script";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { t } = useLocalization();
  const [isEditing, setIsEditing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Иван Иванов",
    email: "ivan@example.com",
    phone: "+7 (999) 999-99-99",
    address: "ул. Примерная, д. 1",
    city: "Москва",
  });

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "card", last4: "4242", brand: "Visa", isDefault: true },
    { id: 2, type: "card", last4: "1234", brand: "Mastercard", isDefault: false },
  ]);

  useEffect(() => {
    // Initialize Google Maps
    if (showMap && window.google) {
      const map = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: { lat: 55.7558, lng: 37.6173 }, // Moscow coordinates
          zoom: 12,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#242f3e" }],
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#242f3e" }],
            },
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#746855" }],
            },
          ],
        }
      );

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { address: `${formData.address}, ${formData.city}` },
        (
          results: google.maps.GeocoderResult[] | null,
          status: google.maps.GeocoderStatus
        ) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const marker = new window.google.maps.Marker({
              map,
              position: results[0].geometry.location,
              animation: google.maps.Animation.DROP,
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div class="p-2"><strong>${formData.fullName}</strong><br>${formData.address}, ${formData.city}</div>`,
            });

            marker.addListener("click", () => {
              infoWindow.open(map, marker);
            });

            map.setCenter(results[0].geometry.location);
          }
        }
      );
    }
  }, [showMap, formData.address, formData.city, formData.fullName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("profileUpdated"));
    setIsEditing(false);
  };

  const handleSetDefaultPayment = (id: number) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    toast.success(t("defaultPaymentUpdated"));
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBqxDlR6oYf5pQn7QxHGLBg_Kz7XgkQGMk&libraries=places"
        onLoad={() => setShowMap(true)}
        strategy="lazyOnload"
      />
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Information */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black dark:text-white">
              {t("profile")}
            </h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium text-white dark:text-black bg-black dark:bg-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {isEditing ? t("save") : t("edit")}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("fullName")}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                />
              ) : (
                <p className="text-black dark:text-white">{formData.fullName}</p>
              )}
            </div>

            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("email")}
              </label>
              <p className="text-black dark:text-white">{formData.email}</p>
            </div>

            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("phone")}
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                />
              ) : (
                <p className="text-black dark:text-white">{formData.phone}</p>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("address")}
              </label>
              {isEditing ? (
                <div className="space-y-4 transform transition-all duration-300 hover:translate-x-1">
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                  />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                    placeholder={t("city")}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-black dark:text-white transform transition-all duration-300 hover:translate-x-1">
                    {formData.address}, {formData.city}
                  </p>
                  <div id="map" className="h-64 w-full rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.02]"></div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-xl font-bold text-black dark:text-white mb-6">
            {t("paymentMethods")}
          </h2>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 transform hover:translate-x-1"
              >
                <div className="flex items-center space-x-4">
                  {method.brand === "Visa" ? (
                    <svg className="w-12 h-8" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="#1A1F71"/>
                      <path d="M18 21L20 11H23L21 21H18Z" fill="white"/>
                      <path d="M28.9 11.3C28.3 11.1 27.3 11 26.1 11C23.5 11 21.6 12.3 21.6 14.2C21.6 15.7 22.9 16.5 23.9 17C24.9 17.5 25.2 17.8 25.2 18.3C25.2 19 24.3 19.3 23.4 19.3C22.2 19.3 21.6 19.2 20.8 18.8L20.4 18.6L20 21.1C20.7 21.4 22 21.6 23.3 21.6C26.1 21.6 28 20.4 28 18.4C28 17.2 27.2 16.3 25.7 15.6C24.8 15.1 24.3 14.8 24.3 14.3C24.3 13.9 24.7 13.5 25.7 13.5C26.5 13.5 27.1 13.6 27.6 13.8L27.9 13.9L28.9 11.3Z" fill="white"/>
                      <path d="M33 11H30.6C29.8 11 29.2 11.2 28.9 12L25 21H28C28 21 28.4 19.9 28.5 19.7C28.8 19.7 31.8 19.7 32.2 19.7C32.3 20 32.5 21 32.5 21H35L33 11ZM29.3 17.7C29.5 17.2 30.6 14.3 30.6 14.3C30.6 14.3 30.9 13.5 31 13.1L31.2 14.2C31.2 14.2 31.9 17.3 32 17.7H29.3Z" fill="white"/>
                      <path d="M16.8 11L14 18.3L13.7 17.1C13.2 15.7 11.9 14.2 10.4 13.3L13 21H16L21 11H16.8Z" fill="white"/>
                    </svg>
                  ) : (
                    <svg className="w-12 h-8" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="#EB001B"/>
                      <circle cx="18" cy="16" r="8" fill="#FF5F00"/>
                      <circle cx="30" cy="16" r="8" fill="#F79E1B"/>
                    </svg>
                  )}
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      {method.brand} •••• {method.last4}
                    </p>
                    {method.isDefault && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("defaultCard")}
                      </span>
                    )}
                  </div>
                </div>
                {!method.isDefault && (
                  <button
                    onClick={() => handleSetDefaultPayment(method.id)}
                    className="text-sm text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors transform hover:scale-105"
                  >
                    {t("setAsDefault")}
                  </button>
                )}
              </div>
            ))}
            <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-white dark:text-black bg-black dark:bg-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95">
              {t("addPaymentMethod")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
