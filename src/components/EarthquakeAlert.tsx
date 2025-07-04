import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, MapPin, Clock, Activity, Zap, Shield } from 'lucide-react';
import { earthquakeService, EarthquakeAlert as EarthquakeAlertType } from '../services/earthquakeService';

const EarthquakeAlert: React.FC = () => {
  const [alerts, setAlerts] = useState<EarthquakeAlertType[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleAlertsUpdate = (newAlerts: EarthquakeAlertType[]) => {
      const activeAlerts = newAlerts.filter(alert => alert.isActive);
      setAlerts(activeAlerts);
      setIsVisible(activeAlerts.length > 0);
    };

    earthquakeService.addListener(handleAlertsUpdate);
    
    // Get initial alerts
    const initialAlerts = earthquakeService.getActiveAlerts();
    if (initialAlerts.length > 0) {
      setAlerts(initialAlerts);
      setIsVisible(true);
    }

    return () => {
      earthquakeService.removeListener(handleAlertsUpdate);
    };
  }, []);

  const handleDismiss = (alertId: string) => {
    earthquakeService.dismissAlert(alertId);
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAlertTypeText = (type: string) => {
    return type === 'forecast' ? '緊急地震速報' : '震度速報';
  };

  const getUrgencyLevel = (scale: number) => {
    if (scale >= 6) return 'critical';
    if (scale >= 5) return 'high';
    if (scale >= 4) return 'medium';
    return 'low';
  };

  if (!isVisible || alerts.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {alerts.map((alert) => {
        const urgencyLevel = getUrgencyLevel(alert.maxScale);
        const scaleColor = earthquakeService.constructor.getScaleColor(alert.maxScale);
        
        return (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -120 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -120 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              type: "spring",
              stiffness: 100
            }}
            className="fixed top-0 left-0 right-0 z-[60] shadow-2xl"
          >
            {/* Main Alert Bar */}
            <div className={`${scaleColor} text-white relative overflow-hidden`}>
              {/* Animated Background Pattern */}
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                style={{
                  backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%)',
                  backgroundSize: '20px 20px'
                }}
              />

              <div className="container mx-auto px-4 py-4 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Alert Icon with Animation */}
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ 
                          scale: urgencyLevel === 'critical' ? [1, 1.3, 1] : [1, 1.15, 1],
                          rotate: urgencyLevel === 'critical' ? [0, 8, -8, 0] : [0, 4, -4, 0]
                        }}
                        transition={{ 
                          duration: urgencyLevel === 'critical' ? 0.8 : 1.2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="relative"
                      >
                        <AlertTriangle size={28} className="text-white drop-shadow-lg" />
                        {urgencyLevel === 'critical' && (
                          <motion.div
                            className="absolute inset-0 border-2 border-white rounded-full"
                            animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                      
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Zap size={18} className="text-yellow-200" />
                          <span className="font-bold text-lg tracking-wide">
                            {getAlertTypeText(alert.type)}
                          </span>
                        </div>
                        <div className="text-xs opacity-90 flex items-center gap-1">
                          <span>発表:</span>
                          <Clock size={12} />
                          <span>{formatTime(alert.issuedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Main Alert Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6">
                        {/* Magnitude and Scale */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                            <Activity size={20} className="text-yellow-200" />
                            <span className="font-bold text-xl">
                              {earthquakeService.constructor.getScaleText(alert.maxScale)}
                            </span>
                          </div>
                          {alert.magnitude && (
                            <div className="bg-white/15 rounded-lg px-3 py-1">
                              <span className="text-sm font-medium">
                                マグニチュード {alert.magnitude.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Location and Time */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin size={16} className="text-blue-200 flex-shrink-0" />
                            <span className="font-medium truncate">{alert.hypocenter}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm opacity-90">
                            <Clock size={16} className="text-green-200 flex-shrink-0" />
                            <span>発生時刻: {formatTime(alert.time)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Safety Message */}
                    <div className="hidden xl:flex items-center gap-3 bg-white/20 rounded-lg px-4 py-2">
                      <Shield size={20} className="text-yellow-200" />
                      <div className="text-sm">
                        <div className="font-bold">身の安全を確保</div>
                        <div className="text-xs opacity-90">机の下に隠れる・火を消す</div>
                      </div>
                    </div>
                  </div>

                  {/* Dismiss Button */}
                  <motion.button
                    onClick={() => handleDismiss(alert.id)}
                    className="ml-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    title="閉じる"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={22} />
                  </motion.button>
                </div>
              </div>

              {/* Progress Bar */}
              <motion.div
                className="h-1 bg-white/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 3, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />
            </div>

            {/* Mobile Safety Message */}
            <motion.div 
              className="xl:hidden bg-black/30 backdrop-blur-sm text-white text-center py-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-3">
                <Shield size={18} className="text-yellow-200" />
                <div className="text-sm">
                  <span className="font-bold">身の安全を確保してください</span>
                  <span className="ml-2 opacity-90">• 机の下に隠れる • 火を消す</span>
                </div>
              </div>
            </motion.div>

            {/* Pulse Effect for Critical Alerts */}
            {urgencyLevel === 'critical' && (
              <motion.div
                className="absolute inset-0 border-4 border-white/50 pointer-events-none"
                animate={{ 
                  scale: [1, 1.02, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            )}
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
};

export default EarthquakeAlert;
