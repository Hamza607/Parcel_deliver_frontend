import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/Badge';
import {
  Package,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Truck,
} from 'lucide-react';

export const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Parcel Consignment - ${order.trackingId}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-mono">TRACKING NUMBER</span>
            <h2 className="text-xl font-bold text-white font-mono tracking-wider">
              {order.trackingId}
            </h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Booked on: {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="text-right">
            <span className="block text-xs text-slate-400 mb-1">CURRENT STATUS</span>
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Sender & Receiver Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sender */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Sender
            </span>
            <p className="font-semibold text-white text-sm">{order.sender?.name}</p>
            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-slate-400" /> {order.sender?.phone}
            </p>
            {order.sender?.city && (
              <p className="text-xs text-slate-400">City: {order.sender.city}</p>
            )}
            <div className="pt-1 border-t border-slate-800 text-xs text-slate-300">
              <span className="text-slate-400 block text-[11px]">Pickup Address:</span>
              {order.pickupAddress}
            </div>
          </div>

          {/* Receiver */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Receiver
            </span>
            <p className="font-semibold text-white text-sm">{order.receiver?.name}</p>
            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-slate-400" /> {order.receiver?.phone}
            </p>
            {order.receiver?.city && (
              <p className="text-xs text-slate-400">City: {order.receiver.city}</p>
            )}
            <div className="pt-1 border-t border-slate-800 text-xs text-slate-300">
              <span className="text-slate-400 block text-[11px]">Destination Address:</span>
              {order.deliveryAddress}
            </div>
          </div>
        </div>

        {/* Parcel Info & Charges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Parcel Specification
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Category:</span>
                <p className="text-white font-medium">{order.parcelInfo?.category || 'Standard'}</p>
              </div>
              <div>
                <span className="text-slate-400">Weight:</span>
                <p className="text-white font-medium">{order.parcelInfo?.weight || 1} KG</p>
              </div>
              <div>
                <span className="text-slate-400">Pieces / Qty:</span>
                <p className="text-white font-medium">{order.parcelInfo?.quantity || 1}</p>
              </div>
              <div>
                <span className="text-slate-400">Billing Type:</span>
                <p className="text-white font-medium">{order.paymentType || 'Account Billed'}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Contents:</span>
              <p className="text-white">{order.parcelInfo?.description}</p>
            </div>
            {order.parcelInfo?.specialInstructions && (
              <div className="text-xs text-amber-300/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                <span className="font-semibold block">Instructions:</span>
                {order.parcelInfo.specialInstructions}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Billing & Charges
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Delivery Service Charge:</span>
                <span className="font-bold text-white text-sm">PKR {order.deliveryCharge?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Cash on Delivery (COD):</span>
                <span className="font-semibold text-emerald-400">
                  {order.codAmount > 0 ? `PKR ${order.codAmount?.toLocaleString()}` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Account Owner:</span>
                <span className="text-slate-200">
                  {order.userId?.name || 'Customer Account'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Status & Delivery Audit Trail
          </h4>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-800">
            {order.statusHistory?.map((item, idx) => (
              <div key={idx} className="relative flex items-start gap-4 pl-8">
                <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{item.status}</span>
                    <span className="text-slate-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {item.note && <p className="text-slate-300 mt-0.5">{item.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </Modal>
  );
};
