import React, { useEffect, useMemo, useState } from 'react';
import './OrderDetailPopup.css';
import { useAuth } from './AdminAuth';
const portalClass = value => String(value || '').split(/\s+/).filter(Boolean).flatMap(name => ({
  "ops-main": ["tsup-operations-ops-main"],
  "ops-heading": ["tsup-operations-ops-heading"],
  "ops-panel": ["tsup-operations-ops-panel"],
  "ops-actions": ["tsup-operations-ops-actions"],
  "ops-row-actions": ["tsup-operations-ops-row-actions"],
  "ops-primary": ["tsup-operations-ops-primary"],
  "ops-metrics": ["tsup-operations-ops-metrics"],
  "ops-quick": ["tsup-operations-ops-quick"],
  "ops-table-wrap": ["tsup-operations-ops-table-wrap"],
  "ops-badge": ["tsup-operations-ops-badge"],
  "ops-toolbar": ["tsup-operations-ops-toolbar"],
  "ops-dates": ["tsup-operations-ops-dates"],
  "ops-pagination": ["tsup-operations-ops-pagination"],
  "ops-alert": ["tsup-operations-ops-alert"],
  "ops-success": ["tsup-operations-ops-success"],
  "ops-empty": ["tsup-operations-ops-empty"],
  "ops-overlay": ["tsup-operations-ops-overlay"],
  "ops-modal": ["tsup-operations-ops-modal"],
  "ops-form": ["tsup-operations-ops-form"],
  "ops-form-grid": ["tsup-operations-ops-form-grid"],
  "ops-nav": ["tsup-operations-ops-nav"],
  "ops-nav-top": ["tsup-operations-ops-nav-top"],
  "ops-brand": ["tsup-operations-ops-brand"],
  "ops-nav-controls": ["tsup-operations-ops-nav-controls"],
  "ops-nav-links": ["tsup-operations-ops-nav-links"],
  "ops-mobile-toggle": ["tsup-operations-ops-mobile-toggle"],
  "ops-pos-grid": ["tsup-operations-ops-pos-grid"],
  "ops-pos-total": ["tsup-operations-ops-pos-total"],
  "ops-pos-qty": ["tsup-operations-ops-pos-qty"],
  "ops-danger": ["tsup-operations-ops-danger"],
  "ops-password": ["tsup-operations-ops-password"],
  "odp-modal": ["tsup-orderdetailpopup-odp-modal"],
  "odp-btn-close": ["tsup-orderdetailpopup-odp-btn-close"],
  "odp-courier-card": ["tsup-orderdetailpopup-odp-courier-card"],
  "odp-courier-head": ["tsup-orderdetailpopup-odp-courier-head"],
  "odp-courier-title": ["tsup-orderdetailpopup-odp-courier-title"],
  "odp-courier-sub": ["tsup-orderdetailpopup-odp-courier-sub"],
  "odp-courier-actions": ["tsup-orderdetailpopup-odp-courier-actions"],
  "odp-muted-btn": ["tsup-orderdetailpopup-odp-muted-btn"],
  "odp-alert": ["tsup-orderdetailpopup-odp-alert"],
  "odp-alert-error": ["tsup-orderdetailpopup-odp-alert-error"],
  "odp-alert-ok": ["tsup-orderdetailpopup-odp-alert-ok"],
  "odp-courier-summary": ["tsup-orderdetailpopup-odp-courier-summary"],
  "odp-summary-pill": ["tsup-orderdetailpopup-odp-summary-pill"],
  "odp-summary-label": ["tsup-orderdetailpopup-odp-summary-label"],
  "odp-summary-value": ["tsup-orderdetailpopup-odp-summary-value"],
  "odp-courier-list": ["tsup-orderdetailpopup-odp-courier-list"],
  "odp-courier-row": ["tsup-orderdetailpopup-odp-courier-row"],
  "odp-courier-row-selected": ["tsup-orderdetailpopup-odp-courier-row-selected"],
  "odp-courier-left": ["tsup-orderdetailpopup-odp-courier-left"],
  "odp-courier-name": ["tsup-orderdetailpopup-odp-courier-name"],
  "odp-courier-meta": ["tsup-orderdetailpopup-odp-courier-meta"],
  "odp-courier-right": ["tsup-orderdetailpopup-odp-courier-right"],
  "odp-courier-price": ["tsup-orderdetailpopup-odp-courier-price"],
  "odp-courier-id": ["tsup-orderdetailpopup-odp-courier-id"],
  "odp-courier-radio": ["tsup-orderdetailpopup-odp-courier-radio"],
  "odp-courier-radio-dot": ["tsup-orderdetailpopup-odp-courier-radio-dot"],
  "on": ["tsup-orderdetailpopup-on"],
  "odp-tag": ["tsup-orderdetailpopup-odp-tag"],
  "odp-tag-danger": ["tsup-orderdetailpopup-odp-tag-danger"],
  "odp-empty": ["tsup-orderdetailpopup-odp-empty"],
  "odp-action-bar": ["tsup-orderdetailpopup-odp-action-bar"],
  "odp-action-left": ["tsup-orderdetailpopup-odp-action-left"],
  "odp-action-title": ["tsup-orderdetailpopup-odp-action-title"],
  "odp-action-sub": ["tsup-orderdetailpopup-odp-action-sub"],
  "odp-action-right": ["tsup-orderdetailpopup-odp-action-right"],
  "odp-primary-btn": ["tsup-orderdetailpopup-odp-primary-btn"],
  "odp-awb-panel": ["tsup-orderdetailpopup-odp-awb-panel"],
  "odp-awb-grid": ["tsup-orderdetailpopup-odp-awb-grid"],
  "odp-awb-item": ["tsup-orderdetailpopup-odp-awb-item"],
  "odp-awb-label": ["tsup-orderdetailpopup-odp-awb-label"],
  "odp-awb-value": ["tsup-orderdetailpopup-odp-awb-value"],
  "odp-awb-actions": ["tsup-orderdetailpopup-odp-awb-actions"],
  "odp-awb-note": ["tsup-orderdetailpopup-odp-awb-note"],
  "odp-formal": ["tsup-orderdetailpopup-odp-formal"],
  "odp-top-card": ["tsup-orderdetailpopup-odp-top-card"],
  "odp-top-left": ["tsup-orderdetailpopup-odp-top-left"],
  "odp-top-title": ["tsup-orderdetailpopup-odp-top-title"],
  "odp-top-sub": ["tsup-orderdetailpopup-odp-top-sub"],
  "odp-top-meta": ["tsup-orderdetailpopup-odp-top-meta"],
  "odp-top-chip": ["tsup-orderdetailpopup-odp-top-chip"],
  "odp-chip-k": ["tsup-orderdetailpopup-odp-chip-k"],
  "odp-chip-v": ["tsup-orderdetailpopup-odp-chip-v"],
  "odp-top-right": ["tsup-orderdetailpopup-odp-top-right"],
  "odp-stepper": ["tsup-orderdetailpopup-odp-stepper"],
  "odp-step": ["tsup-orderdetailpopup-odp-step"],
  "active": ["tsup-orderdetailpopup-active"],
  "done": ["tsup-orderdetailpopup-done"],
  "odp-step-dot": ["tsup-orderdetailpopup-odp-step-dot"],
  "odp-step-text": ["tsup-orderdetailpopup-odp-step-text"],
  "odp-step-title": ["tsup-orderdetailpopup-odp-step-title"],
  "odp-step-sub": ["tsup-orderdetailpopup-odp-step-sub"],
  "odp-step-card": ["tsup-orderdetailpopup-odp-step-card"],
  "odp-step-card-disabled": ["tsup-orderdetailpopup-odp-step-card-disabled"],
  "odp-step-card-head": ["tsup-orderdetailpopup-odp-step-card-head"],
  "odp-step-card-title": ["tsup-orderdetailpopup-odp-step-card-title"],
  "odp-step-card-sub": ["tsup-orderdetailpopup-odp-step-card-sub"],
  "odp-step-card-actions": ["tsup-orderdetailpopup-odp-step-card-actions"],
  "odp-payment-box": ["tsup-orderdetailpopup-odp-payment-box"],
  "odp-payment-line": ["tsup-orderdetailpopup-odp-payment-line"],
  "odp-pay-k": ["tsup-orderdetailpopup-odp-pay-k"],
  "odp-pay-v": ["tsup-orderdetailpopup-odp-pay-v"],
  "odp-payment-actions": ["tsup-orderdetailpopup-odp-payment-actions"],
  "odp-primary-link": ["tsup-orderdetailpopup-odp-primary-link"],
  "odp-docs-row": ["tsup-orderdetailpopup-odp-docs-row"],
  "odp-wallet-row": ["tsup-orderdetailpopup-odp-wallet-row"],
  "odp-wallet-left": ["tsup-orderdetailpopup-odp-wallet-left"],
  "odp-wallet-title": ["tsup-orderdetailpopup-odp-wallet-title"],
  "odp-wallet-sub": ["tsup-orderdetailpopup-odp-wallet-sub"],
  "odp-wallet-actions": ["tsup-orderdetailpopup-odp-wallet-actions"],
  "odp-track-card": ["tsup-orderdetailpopup-odp-track-card"],
  "odp-track-head": ["tsup-orderdetailpopup-odp-track-head"],
  "odp-track-title": ["tsup-orderdetailpopup-odp-track-title"],
  "odp-track-sub": ["tsup-orderdetailpopup-odp-track-sub"],
  "odp-track-grid": ["tsup-orderdetailpopup-odp-track-grid"],
  "odp-track-item": ["tsup-orderdetailpopup-odp-track-item"],
  "odp-track-k": ["tsup-orderdetailpopup-odp-track-k"],
  "odp-track-v": ["tsup-orderdetailpopup-odp-track-v"],
  "odp-track-events": ["tsup-orderdetailpopup-odp-track-events"],
  "odp-track-event": ["tsup-orderdetailpopup-odp-track-event"],
  "odp-track-ev-time": ["tsup-orderdetailpopup-odp-track-ev-time"],
  "odp-track-ev-text": ["tsup-orderdetailpopup-odp-track-ev-text"],
  "odp-track-ev-loc": ["tsup-orderdetailpopup-odp-track-ev-loc"]
})[name] || ["tsup-orderdetailpopup-" + name]).join(' ');
export default function OrderDetailPopup({
  open,
  loading,
  detail,
  onClose,
  apiBase,
  orderSteps,
  statusText,
  computeStepFromLocal,
  computeStepFromShiprocket,
  computeStepFromShipment,
  buildExpectedDeliveryText,
  fmt
}) {
  const {
    token
  } = useAuth();
  const authHeaders = useMemo(() => {
    return token ? {
      Authorization: `Bearer ${token}`
    } : {};
  }, [token]);
  const [courierLoading, setCourierLoading] = useState(false);
  const [courierError, setCourierError] = useState('');
  const [courierData, setCourierData] = useState(null);
  const [selectedCourierId, setSelectedCourierId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionOk, setActionOk] = useState('');
  const [walletMessage, setWalletMessage] = useState('');
  const [localShipment, setLocalShipment] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const sale = detail?.sale || null;
  const items = Array.isArray(detail?.items) ? detail.items : [];
  const shipments = Array.isArray(detail?.shipments) ? detail.shipments : [];
  const trackingSnapshot = detail?.trackingSnapshot || {
    status: '',
    eddText: null,
    lastEventText: null,
    core: null
  };
  const latestShipmentFromDetail = detail?.latestShipment || (shipments.length ? shipments[shipments.length - 1] : null);
  const latestShipment = localShipment || latestShipmentFromDetail;
  const localOrderStatus = sale ? statusText(sale.status || 'PLACED') : '';
  const isCancelled = localOrderStatus === 'CANCELLED';
  const shiprocketStatus = statusText(trackingSnapshot.status);
  const shipmentStepIndex = computeStepFromShipment(latestShipment, trackingSnapshot.core);
  const baseLocalStep = computeStepFromLocal(localOrderStatus);
  const baseShiprocketStep = computeStepFromShiprocket(shiprocketStatus);
  const effectiveStepIndex = sale ? Math.max(baseLocalStep, baseShiprocketStep, shipmentStepIndex) : 0;
  const placedText = sale?.created_at ? new Date(sale.created_at).toLocaleString('en-IN') : '-';
  const expectedDelivery = sale ? buildExpectedDeliveryText(trackingSnapshot, sale, latestShipment) : '-';
  const lastUpdateTime = (() => {
    if (!detail) return '-';
    if (trackingSnapshot.lastEventText) return trackingSnapshot.lastEventText;
    const fallbackTime = latestShipment?.updated_at || latestShipment?.created_at || sale?.updated_at || sale?.created_at;
    if (!fallbackTime) return '-';
    const t = new Date(fallbackTime);
    if (Number.isNaN(t.getTime())) return '-';
    return t.toLocaleString('en-IN');
  })();
  const hasAwb = !!latestShipment?.awb;
  const shipmentId = latestShipment?.shipment_id || latestShipment?.shiprocket_shipment_id || null;
  const shiprocketOrderId = latestShipment?.shiprocket_order_id || latestShipment?.order_id || null;
  const srData = useMemo(() => {
    return courierData?.data?.data || courierData?.data || courierData || null;
  }, [courierData]);
  const availableCouriers = useMemo(() => {
    return Array.isArray(srData?.available_courier_companies) ? srData.available_courier_companies : [];
  }, [srData]);
  const recommendedCourierCompanyId = useMemo(() => {
    return srData?.recommended_courier_company_id || srData?.shiprocket_recommended_courier_id || null;
  }, [srData]);
  const codValue = useMemo(() => {
    return typeof srData?.cod === 'boolean' ? srData.cod : typeof courierData?.cod === 'boolean' ? courierData.cod : false;
  }, [srData, courierData]);
  useEffect(() => {
    if (!open) {
      setCourierLoading(false);
      setCourierError('');
      setCourierData(null);
      setSelectedCourierId(null);
      setActionLoading(false);
      setActionError('');
      setActionOk('');
      setWalletMessage('');
      setLocalShipment(null);
      setTrackingLoading(false);
      setTrackingError('');
      setTrackingData(null);
    }
  }, [open]);
  useEffect(() => {
    if (!courierData) return;
    const initial = selectedCourierId || recommendedCourierCompanyId || (availableCouriers.length ? availableCouriers[0]?.courier_company_id : null);
    if (initial) setSelectedCourierId(initial);
  }, [courierData, selectedCourierId, recommendedCourierCompanyId, availableCouriers]);
  const tryFetchJson = async (url, options) => {
    const res = await fetch(url, options);
    const txt = await res.text().catch(() => '');
    let json = null;
    try {
      json = txt ? JSON.parse(txt) : null;
    } catch {
      json = null;
    }
    return {
      res,
      json,
      text: txt
    };
  };
  const loadServiceability = async () => {
    if (!sale?.id) return;
    setCourierLoading(true);
    setCourierError('');
    setCourierData(null);
    setSelectedCourierId(null);
    setActionOk('');
    setActionError('');
    setWalletMessage('');
    try {
      const candidates = [{
        url: `${apiBase}/api/shiprocket/serviceability/by-sale/${sale.id}`,
        opts: {
          headers: {
            ...authHeaders
          }
        }
      }, {
        url: `${apiBase}/api/shiprocket/serviceability/sale/${sale.id}`,
        opts: {
          headers: {
            ...authHeaders
          }
        }
      }, {
        url: `${apiBase}/api/shiprocket/serviceability/${sale.id}`,
        opts: {
          headers: {
            ...authHeaders
          }
        }
      }];
      let ok = false;
      let payload = null;
      for (const c of candidates) {
        try {
          const {
            res,
            json
          } = await tryFetchJson(c.url, c.opts);
          if (res.ok && json) {
            ok = true;
            payload = json;
            break;
          }
        } catch {
          ok = false;
        }
      }
      if (!ok) {
        setCourierError('Could not fetch courier options for this order.');
        return;
      }
      setCourierData(payload);
    } finally {
      setCourierLoading(false);
    }
  };
  const shiprocketWalletUrl = 'https://app.shiprocket.in/dashboard/settings/wallet';
  const parseAwbFromAssignResponse = payload => {
    const data = payload?.data || payload?.result || payload || null;
    const statusCode = Number(data?.status_code || payload?.status_code || 0);
    const msg = data?.message || payload?.message || '';
    const awbAssignStatus = data?.awb_assign_status != null ? Number(data.awb_assign_status) : data?.response?.awb_assign_status != null ? Number(data.response.awb_assign_status) : null;
    const possibleAwb = payload?.awb || payload?.data?.awb || payload?.result?.awb || payload?.result?.data?.awb || payload?.data?.data?.awb || payload?.shipment?.awb || null;
    const errorFromSr = data?.response?.data?.awb_assign_error || data?.response?.awb_assign_error || data?.awb_assign_error || payload?.awb_assign_error || '';
    const isWalletLow = statusCode === 350 || /recharge/i.test(String(msg)) || /recharge/i.test(String(errorFromSr));
    const isSuccess = !!possibleAwb || awbAssignStatus === 1 || statusCode === 200;
    return {
      statusCode,
      msg,
      isWalletLow,
      isSuccess,
      possibleAwb,
      errorFromSr
    };
  };
  const assignCourierAndGenerateAwb = async () => {
    if (!sale?.id) return;
    if (!selectedCourierId) {
      setActionError('Please select a courier partner.');
      return;
    }
    setActionLoading(true);
    setActionError('');
    setActionOk('');
    setWalletMessage('');
    try {
      const body = {
        sale_id: sale.id,
        courier_company_id: Number(selectedCourierId)
      };
      const candidates = [{
        url: `${apiBase}/api/shiprocket/assign-courier`,
        opts: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          },
          body: JSON.stringify(body)
        }
      }, {
        url: `${apiBase}/api/shiprocket/assign-awb`,
        opts: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          },
          body: JSON.stringify(body)
        }
      }, {
        url: `${apiBase}/api/shiprocket/assign-courier/by-sale/${sale.id}`,
        opts: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          },
          body: JSON.stringify({
            courier_company_id: Number(selectedCourierId)
          })
        }
      }];
      let payload = null;
      let lastJson = null;
      for (const c of candidates) {
        try {
          const {
            res,
            json
          } = await tryFetchJson(c.url, c.opts);
          lastJson = json;
          if (json) {
            payload = json;
            if (res.ok) break;
          }
        } catch {
          payload = null;
        }
      }
      if (!payload) {
        setActionError('Could not process Shiprocket request.');
        return;
      }
      if (payload?.ok === false) {
        const m = payload?.message || 'Shiprocket request failed.';
        setActionError(m);
        if (/recharge/i.test(m)) setWalletMessage(m);
        return;
      }
      const parsed = parseAwbFromAssignResponse(payload);
      if (parsed.isWalletLow) {
        const m = parsed.errorFromSr || parsed.msg || 'Please recharge your Shiprocket wallet.';
        setWalletMessage(m);
        setActionError(m);
        return;
      }
      if (!parsed.isSuccess) {
        const m = parsed.errorFromSr || parsed.msg || lastJson?.message || 'Unable to generate AWB.';
        setActionError(m);
        return;
      }
      const nextShipment = {
        ...(latestShipment || {}),
        awb: parsed.possibleAwb || latestShipment?.awb,
        courier_name: payload?.courier_name || payload?.data?.courier_name || payload?.shipment?.courier_name || latestShipment?.courier_name,
        courier_company_id: payload?.courier_company_id || payload?.data?.courier_company_id || payload?.shipment?.courier_company_id || latestShipment?.courier_company_id,
        shiprocket_order_id: payload?.shiprocket_order_id || payload?.data?.shiprocket_order_id || payload?.shipment?.shiprocket_order_id || latestShipment?.shiprocket_order_id,
        shipment_id: payload?.shipment_id || payload?.data?.shipment_id || payload?.shipment?.shipment_id || latestShipment?.shipment_id,
        shiprocket_shipment_id: payload?.shiprocket_shipment_id || payload?.data?.shiprocket_shipment_id || payload?.shipment?.shiprocket_shipment_id || latestShipment?.shiprocket_shipment_id,
        status: payload?.status || payload?.shipment_status || latestShipment?.status
      };
      setLocalShipment(nextShipment);
      setActionOk('AWB generated successfully.');
      setActionError('');
      setWalletMessage('');
    } finally {
      setActionLoading(false);
    }
  };
  const fetchTracking = async () => {
    if (!sale?.id) return;
    setTrackingLoading(true);
    setTrackingError('');
    try {
      const {
        res,
        json
      } = await tryFetchJson(`${apiBase}/api/shiprocket/tracking/by-sale/${sale.id}`, {
        headers: {
          ...authHeaders
        }
      });
      if (!res.ok || !json) {
        setTrackingError(json?.message || 'Unable to fetch tracking.');
        return;
      }
      if (json?.ok === false) {
        setTrackingError(json?.message || 'Unable to fetch tracking.');
        return;
      }
      setTrackingData(json);
    } finally {
      setTrackingLoading(false);
    }
  };
  const stop = e => e.stopPropagation();
  if (!open) return null;
  const courierSummary = c => {
    const price = c?.rate ?? c?.freight_charge ?? c?.cost ?? null;
    const etd = c?.etd || null;
    const days = c?.estimated_delivery_days || null;
    const rating = c?.rating ?? null;
    const mode = c?.is_surface ? 'Surface' : c?.mode === 0 ? 'Surface' : 'Air';
    return {
      price,
      etd,
      days,
      rating,
      mode
    };
  };
  const selectedCourier = availableCouriers.find(c => Number(c.courier_company_id) === Number(selectedCourierId)) || null;
  const selectedCourierMeta = selectedCourier ? courierSummary(selectedCourier) : null;
  const step1Done = !!selectedCourierId;
  const step2Done = !!hasAwb;
  const step3Done = step2Done;
  const trackingCore = trackingData?.data || trackingData?.tracking || trackingData || null;
  const trackingEvents = Array.isArray(trackingCore?.tracking_data?.shipment_track_activities) ? trackingCore.tracking_data.shipment_track_activities : Array.isArray(trackingCore?.tracking_data?.shipment_track?.activities) ? trackingCore.tracking_data.shipment_track.activities : Array.isArray(trackingCore?.tracking_data?.track_status) ? trackingCore.tracking_data.track_status : [];
  const trackingHeader = (() => {
    const td = trackingCore?.tracking_data || null;
    const st = td?.shipment_track?.[0] || td?.shipment_track || null;
    return {
      courier: st?.courier_name || latestShipment?.courier_name || '-',
      awb: st?.awb_code || latestShipment?.awb || '-',
      current: td?.shipment_track?.[0]?.current_status || td?.shipment_track?.current_status || td?.track_status || '-',
      pickupDate: td?.shipment_track?.[0]?.pickup_date || td?.shipment_track?.pickup_date || '-',
      deliveredDate: td?.shipment_track?.[0]?.delivered_date || td?.shipment_track?.delivered_date || '-'
    };
  })();
  return <div className={portalClass("orders-modal-backdrop")} onClick={onClose}>
      <div className={portalClass("orders-modal orders-modal-detail odp-modal odp-formal")} onClick={stop}>
        {loading ? <div className={portalClass("orders-loader")}>
            <div className={portalClass("orders-spinner")} />
            <span className={portalClass("orders-loader-text")}>Loading order details</span>
          </div> : !detail || !sale ? <div className={portalClass("orders-empty-state")}>
            <div className={portalClass("orders-empty-icon")} />
            <h3 className={portalClass("orders-empty-title")}>Unable to load order</h3>
            <p className={portalClass("orders-empty-text")}>Please refresh and try again.</p>
            <button className={portalClass("orders-btn-small odp-btn-close")} onClick={onClose}>
              Close
            </button>
          </div> : <>
            <div className={portalClass("orders-modal-header")}>
              <div className="tsup-orderdetailpopup-node-0">
                <h3 className={portalClass("orders-modal-title")}>Order #{sale?.id}</h3>
                <p className={portalClass("orders-modal-subtitle")}>Placed on {placedText}</p>
              </div>
              <div className={portalClass("orders-modal-header-actions")}>
                <span className={portalClass(`orders-status-pill orders-status-${String(sale?.status || '').toLowerCase()} orders-status-pill-lg`)}>
                  {localOrderStatus || '-'}
                </span>
                <button className={portalClass("orders-btn-small orders-btn-ghost")} onClick={onClose}>
                  Close
                </button>
              </div>
            </div>

            <div className={portalClass("odp-top-card")}>
              <div className={portalClass("odp-top-left")}>
                <div className={portalClass("odp-top-title")}>Order summary</div>
                <div className={portalClass("odp-top-sub")}>
                  {items.length} item{items.length === 1 ? '' : 's'} · {String(sale?.payment_status || 'COD').toUpperCase()} · {fmt(sale?.totals?.payable ?? sale?.total)}
                </div>
                <div className={portalClass("odp-top-meta")}>
                  <div className={portalClass("odp-top-chip")}>
                    <span className={portalClass("odp-chip-k")}>Expected delivery</span>
                    <span className={portalClass("odp-chip-v")}>{expectedDelivery}</span>
                  </div>
                  <div className={portalClass("odp-top-chip")}>
                    <span className={portalClass("odp-chip-k")}>Last update</span>
                    <span className={portalClass("odp-chip-v")}>{lastUpdateTime}</span>
                  </div>
                  <div className={portalClass("odp-top-chip")}>
                    <span className={portalClass("odp-chip-k")}>COD</span>
                    <span className={portalClass("odp-chip-v")}>{codValue ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
              <div className={portalClass("odp-top-right")}>
                <div className={portalClass("odp-stepper")}>
                  <div className={portalClass(`odp-step ${step1Done ? 'done' : 'active'}`)}>
                    <div className={portalClass("odp-step-dot")} />
                    <div className={portalClass("odp-step-text")}>
                      <div className={portalClass("odp-step-title")}>Step 1</div>
                      <div className={portalClass("odp-step-sub")}>Select courier partner</div>
                    </div>
                  </div>
                  <div className={portalClass(`odp-step ${step2Done ? 'done' : step1Done ? 'active' : ''}`)}>
                    <div className={portalClass("odp-step-dot")} />
                    <div className={portalClass("odp-step-text")}>
                      <div className={portalClass("odp-step-title")}>Step 2</div>
                      <div className={portalClass("odp-step-sub")}>Wallet payment and AWB</div>
                    </div>
                  </div>
                  <div className={portalClass(`odp-step ${step3Done ? 'done' : step2Done ? 'active' : ''}`)}>
                    <div className={portalClass("odp-step-dot")} />
                    <div className={portalClass("odp-step-text")}>
                      <div className={portalClass("odp-step-title")}>Step 3</div>
                      <div className={portalClass("odp-step-sub")}>Documents and tracking</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={portalClass("orders-progress-card")}>
              <div className={portalClass("orders-progress-header")}>
                <div className={portalClass("orders-progress-header-main")}>
                  <div className={portalClass("orders-progress-title")}>Fulfilment progress</div>
                  <div className={portalClass("orders-progress-header-sub")}>Status across order, shipment, and Shiprocket</div>
                </div>
                <div className={portalClass("orders-progress-status-pill")}>
                  {isCancelled ? 'Order cancelled' : effectiveStepIndex === orderSteps.length - 1 ? 'Delivered to customer' : `Currently ${orderSteps[effectiveStepIndex].toLowerCase()}`}
                </div>
              </div>

              <div className={portalClass(`orders-timeline ${isCancelled ? 'orders-timeline-cancelled' : ''}`)}>
                <div className={portalClass("orders-timeline-line")} />
                <div className={portalClass("orders-timeline-steps")}>
                  {orderSteps.map((step, index) => {
                const stepState = isCancelled && step !== 'PLACED' ? 'upcoming' : index < effectiveStepIndex ? 'done' : index === effectiveStepIndex ? 'active' : 'upcoming';
                return <div className={portalClass("orders-timeline-step")} key={step}>
                        <div className={portalClass(`orders-timeline-dot orders-timeline-dot-${stepState}`)} />
                        <div className={portalClass("orders-timeline-label")}>{step}</div>
                        <div className={portalClass("orders-timeline-caption")}>
                          {step === 'PLACED' && 'Order captured'}
                          {step === 'CONFIRMED' && 'Verified'}
                          {step === 'PACKED' && 'Packed'}
                          {step === 'SHIPPED' && 'Out for delivery'}
                          {step === 'DELIVERED' && 'Delivered'}
                        </div>
                      </div>;
              })}
                </div>
              </div>

              <div className={portalClass("orders-progress-footer")}>
                <div className={portalClass("orders-progress-meta")}>
                  <span className={portalClass("orders-progress-meta-label")}>AWB</span>
                  <span className={portalClass("orders-progress-meta-value")}>{latestShipment?.awb || '-'}</span>
                </div>
                <div className={portalClass("orders-progress-meta")}>
                  <span className={portalClass("orders-progress-meta-label")}>Shipment id</span>
                  <span className={portalClass("orders-progress-meta-value")}>{shipmentId || '-'}</span>
                </div>
                <div className={portalClass("orders-progress-meta")}>
                  <span className={portalClass("orders-progress-meta-label")}>Shiprocket order</span>
                  <span className={portalClass("orders-progress-meta-value")}>{shiprocketOrderId || '-'}</span>
                </div>
              </div>
            </div>

            <div className={portalClass("odp-step-card")}>
              <div className={portalClass("odp-step-card-head")}>
                <div className="tsup-orderdetailpopup-node-1">
                  <div className={portalClass("odp-step-card-title")}>Step 1: Select courier partner</div>
                  <div className={portalClass("odp-step-card-sub")}>Fetch courier options for the delivery pincode and choose one</div>
                </div>
                <div className={portalClass("odp-step-card-actions")}>
                  <button className={portalClass("orders-btn-small")} onClick={loadServiceability} disabled={courierLoading || actionLoading}>
                    {courierLoading ? 'Loading…' : 'Get courier options'}
                  </button>
                </div>
              </div>

              {courierError ? <div className={portalClass("odp-alert odp-alert-error")}>{courierError}</div> : null}

              {courierData ? <>
                  <div className={portalClass("odp-courier-summary")}>
                    <div className={portalClass("odp-summary-pill")}>
                      <span className={portalClass("odp-summary-label")}>Recommended</span>
                      <span className={portalClass("odp-summary-value")}>{recommendedCourierCompanyId ? `#${recommendedCourierCompanyId}` : '-'}</span>
                    </div>
                    <div className={portalClass("odp-summary-pill")}>
                      <span className={portalClass("odp-summary-label")}>Available</span>
                      <span className={portalClass("odp-summary-value")}>{availableCouriers.length}</span>
                    </div>
                    <div className={portalClass("odp-summary-pill")}>
                      <span className={portalClass("odp-summary-label")}>COD</span>
                      <span className={portalClass("odp-summary-value")}>{codValue ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  <div className={portalClass("odp-courier-list")}>
                    {availableCouriers.length ? availableCouriers.map(c => {
                const meta = courierSummary(c);
                const isSelected = Number(selectedCourierId) === Number(c.courier_company_id);
                const isRecommended = recommendedCourierCompanyId && Number(recommendedCourierCompanyId) === Number(c.courier_company_id);
                return <button key={String(c.id || c.courier_company_id)} type="button" className={portalClass(`odp-courier-row ${isSelected ? 'odp-courier-row-selected' : ''}`)} onClick={() => setSelectedCourierId(Number(c.courier_company_id))}>
                            <div className={portalClass("odp-courier-left")}>
                              <div className={portalClass("odp-courier-name")}>
                                <span className={portalClass("odp-courier-radio")} aria-hidden="true">
                                  <span className={portalClass(`odp-courier-radio-dot ${isSelected ? 'on' : ''}`)} />
                                </span>
                                <span className="tsup-orderdetailpopup-node-2">{c.courier_name || `Courier #${c.courier_company_id}`}</span>
                                {isRecommended ? <span className={portalClass("odp-tag")}>Recommended</span> : null}
                                {c.blocked ? <span className={portalClass("odp-tag odp-tag-danger")}>Blocked</span> : null}
                              </div>
                              <div className={portalClass("odp-courier-meta")}>
                                <span className="tsup-orderdetailpopup-node-3">{meta.mode}</span>
                                {meta.days ? <span className="tsup-orderdetailpopup-node-4">· {meta.days} days</span> : null}
                                {meta.etd ? <span className="tsup-orderdetailpopup-node-5">· ETD {meta.etd}</span> : null}
                                {meta.rating ? <span className="tsup-orderdetailpopup-node-6">· ⭐ {meta.rating}</span> : null}
                              </div>
                            </div>
                            <div className={portalClass("odp-courier-right")}>
                              <div className={portalClass("odp-courier-price")}>{meta.price != null && meta.price !== '' ? fmt(meta.price) : '-'}</div>
                              <div className={portalClass("odp-courier-id")}>#{c.courier_company_id}</div>
                            </div>
                          </button>;
              }) : <div className={portalClass("odp-empty")}>No couriers returned for this order.</div>}
                  </div>
                </> : null}
            </div>

            <div className={portalClass(`odp-step-card ${!step1Done ? 'odp-step-card-disabled' : ''}`)}>
              <div className={portalClass("odp-step-card-head")}>
                <div className="tsup-orderdetailpopup-node-7">
                  <div className={portalClass("odp-step-card-title")}>Step 2: Wallet payment and generate AWB</div>
                  <div className={portalClass("odp-step-card-sub")}>Shiprocket charges from wallet during AWB generation. Recharge if balance is low.</div>
                </div>
              </div>

              {actionError ? <div className={portalClass("odp-alert odp-alert-error")}>{actionError}</div> : null}
              {walletMessage ? <div className={portalClass("odp-wallet-row")}>
                  <div className={portalClass("odp-wallet-left")}>
                    <div className={portalClass("odp-wallet-title")}>Wallet attention needed</div>
                    <div className={portalClass("odp-wallet-sub")}>{walletMessage}</div>
                  </div>
                  <div className={portalClass("odp-wallet-actions")}>
                    <a className={portalClass("orders-btn-small odp-primary-link")} href={shiprocketWalletUrl} target="_blank" rel="noopener noreferrer">
                      Recharge wallet
                    </a>
                  </div>
                </div> : null}

              <div className={portalClass("odp-payment-box")}>
                <div className={portalClass("odp-payment-line")}>
                  <span className={portalClass("odp-pay-k")}>Selected courier</span>
                  <span className={portalClass("odp-pay-v")}>{selectedCourier ? selectedCourier.courier_name : '-'}</span>
                </div>
                <div className={portalClass("odp-payment-line")}>
                  <span className={portalClass("odp-pay-k")}>Estimated shipping charge</span>
                  <span className={portalClass("odp-pay-v")}>{selectedCourierMeta?.price != null && selectedCourierMeta?.price !== '' ? fmt(selectedCourierMeta.price) : '-'}</span>
                </div>
                <div className={portalClass("odp-payment-line")}>
                  <span className={portalClass("odp-pay-k")}>Payment mode</span>
                  <span className={portalClass("odp-pay-v")}>Shiprocket wallet</span>
                </div>

                <div className={portalClass("odp-payment-actions")}>
                  <button className={portalClass("orders-btn-small odp-primary-btn")} onClick={assignCourierAndGenerateAwb} disabled={!step1Done || actionLoading || courierLoading}>
                    {actionLoading ? 'Processing…' : 'Generate AWB'}
                  </button>
                  <a className={portalClass("orders-btn-small orders-btn-ghost")} href={shiprocketWalletUrl} target="_blank" rel="noopener noreferrer">
                    Open wallet
                  </a>
                </div>

                {actionOk ? <div className={portalClass("odp-alert odp-alert-ok")}>{actionOk}</div> : null}
              </div>
            </div>

            <div className={portalClass(`odp-step-card ${!hasAwb ? 'odp-step-card-disabled' : ''}`)}>
              <div className={portalClass("odp-step-card-head")}>
                <div className="tsup-orderdetailpopup-node-8">
                  <div className={portalClass("odp-step-card-title")}>Step 3: Documents and tracking</div>
                  <div className={portalClass("odp-step-card-sub")}>Documents become available only after AWB is generated</div>
                </div>
                <div className={portalClass("odp-step-card-actions")}>
                  <button className={portalClass("orders-btn-small")} onClick={fetchTracking} disabled={!hasAwb || trackingLoading}>
                    {trackingLoading ? 'Refreshing…' : 'Refresh tracking'}
                  </button>
                </div>
              </div>

              {!hasAwb ? <div className={portalClass("odp-empty")}>Generate AWB to unlock label, invoice, manifest, and tracking.</div> : <>
                  <div className={portalClass("odp-docs-row")}>
                    <a href={`${apiBase}/api/shiprocket/label/${sale?.id}`} target="_blank" rel="noopener noreferrer" className={portalClass("orders-btn-small")}>
                      Download label
                    </a>
                    <a href={`${apiBase}/api/shiprocket/invoice/${sale?.id}`} target="_blank" rel="noopener noreferrer" className={portalClass("orders-btn-small")}>
                      Download tax invoice
                    </a>
                    <a href={`${apiBase}/api/shiprocket/manifest/${sale?.id}`} target="_blank" rel="noopener noreferrer" className={portalClass("orders-btn-small")}>
                      Download manifest
                    </a>
                  </div>

                  {trackingError ? <div className={portalClass("odp-alert odp-alert-error")}>{trackingError}</div> : null}

                  <div className={portalClass("odp-track-card")}>
                    <div className={portalClass("odp-track-head")}>
                      <div className={portalClass("odp-track-title")}>Live tracking (Shiprocket)</div>
                      <div className={portalClass("odp-track-sub")}>Pickup, in transit, and delivery updates from Shiprocket</div>
                    </div>

                    <div className={portalClass("odp-track-grid")}>
                      <div className={portalClass("odp-track-item")}>
                        <div className={portalClass("odp-track-k")}>Courier</div>
                        <div className={portalClass("odp-track-v")}>{trackingHeader.courier}</div>
                      </div>
                      <div className={portalClass("odp-track-item")}>
                        <div className={portalClass("odp-track-k")}>AWB</div>
                        <div className={portalClass("odp-track-v")}>{trackingHeader.awb}</div>
                      </div>
                      <div className={portalClass("odp-track-item")}>
                        <div className={portalClass("odp-track-k")}>Pickup</div>
                        <div className={portalClass("odp-track-v")}>{trackingHeader.pickupDate}</div>
                      </div>
                      <div className={portalClass("odp-track-item")}>
                        <div className={portalClass("odp-track-k")}>Delivered</div>
                        <div className={portalClass("odp-track-v")}>{trackingHeader.deliveredDate}</div>
                      </div>
                    </div>

                    <div className={portalClass("odp-track-events")}>
                      {trackingEvents.length ? trackingEvents.slice(0, 20).map((ev, idx) => <div key={idx} className={portalClass("odp-track-event")}>
                            <div className={portalClass("odp-track-ev-time")}>{ev?.date || ev?.activity_date_time || ev?.datetime || '-'}</div>
                            <div className={portalClass("odp-track-ev-text")}>{ev?.activity || ev?.status || ev?.remark || ev?.description || '-'}</div>
                            <div className={portalClass("odp-track-ev-loc")}>{ev?.location || ev?.city || ev?.pickup_location || '-'}</div>
                          </div>) : <div className={portalClass("odp-empty")}>No tracking events yet. Try refresh after pickup is requested.</div>}
                    </div>
                  </div>
                </>}
            </div>

            {sale?.shipping_address ? <div className={portalClass("orders-shipping-card")}>
                <div className={portalClass("orders-shipping-header")}>
                  <h4 className={portalClass("orders-shipping-title")}>Shipping address</h4>
                  <span className={portalClass("orders-shipping-tag")}>Delivery</span>
                </div>
                <div className={portalClass("orders-shipping-body")}>
                  <p className="tsup-orderdetailpopup-node-9">{sale.shipping_address.line1}</p>
                  {sale.shipping_address.line2 ? <p className="tsup-orderdetailpopup-node-10">{sale.shipping_address.line2}</p> : null}
                  <p className="tsup-orderdetailpopup-node-11">
                    {sale.shipping_address.city} {sale.shipping_address.state} - {sale.shipping_address.pincode}
                  </p>
                </div>
              </div> : null}

            <div className={portalClass("orders-items-header")}>
              <div className="tsup-orderdetailpopup-node-12">
                <p className={portalClass("orders-items-title")}>Items in this order</p>
                <p className={portalClass("orders-items-subtitle")}>
                  {items.length} item{items.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <div className={portalClass("orders-items-grid")}>
              {items.length ? items.map((it, i) => <div className={portalClass("orders-item-card")} key={`${it.variant_id}-${i}`}>
                    <div className={portalClass("orders-item-media")}>{it.image_url ? <img src={it.image_url} alt="" className="tsup-orderdetailpopup-node-13" /> : <div className={portalClass("orders-item-placeholder")} />}</div>
                    <div className={portalClass("orders-item-main")}>
                      <div className={portalClass("orders-item-top")}>
                        <div className={portalClass("orders-item-meta")}>
                          <span className={portalClass("orders-item-label")}>Variant</span>
                          <span className={portalClass("orders-item-value")}>#{it.variant_id}</span>
                        </div>
                        <div className={portalClass("orders-item-meta")}>
                          <span className={portalClass("orders-item-label")}>Size</span>
                          <span className={portalClass("orders-item-value")}>{it.size || '-'}</span>
                        </div>
                        <div className={portalClass("orders-item-meta")}>
                          <span className={portalClass("orders-item-label")}>Colour</span>
                          <span className={portalClass("orders-item-value")}>{it.colour || '-'}</span>
                        </div>
                        <div className={portalClass("orders-item-meta")}>
                          <span className={portalClass("orders-item-label")}>EAN</span>
                          <span className={portalClass("orders-item-value orders-text-soft")}>{it.ean_code || '-'}</span>
                        </div>
                      </div>
                      <div className={portalClass("orders-item-pricing")}>
                        <div className={portalClass("orders-item-qty")}>x{it.qty}</div>
                        <div className={portalClass("orders-item-price")}>{fmt(it.price)}</div>
                        {it.mrp != null && Number(it.mrp) > 0 ? <div className={portalClass("orders-item-mrp")}>MRP {fmt(it.mrp)}</div> : null}
                      </div>
                    </div>
                  </div>) : <div className={portalClass("orders-empty-inline")}>No items in this order</div>}
            </div>
          </>}
      </div>
    </div>;
}
