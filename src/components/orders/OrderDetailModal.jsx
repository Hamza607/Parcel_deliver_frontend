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
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-mono">TRACKING NUMBER</span>
            <h2 className="text-xl font-extrabold text-slate-900 font-mono tracking-wider">
              {order.trackingId}
            </h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              Booked on: {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="text-right">
            <span className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">CURRENT STATUS</span>
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Sender & Receiver Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sender */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Sender
            </span>
            <p className="font-bold text-slate-900 text-sm">{order.sender?.name}</p>
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-slate-400" /> {order.sender?.phone}
            </p>
            {order.sender?.city && (
              <p className="text-xs text-slate-500">City: {order.sender.city}</p>
            )}
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-700">
              <span className="text-slate-400 block text-[11px] font-medium">Pickup Address:</span>
              {order.pickupAddress}
            </div>
          </div>

          {/* Receiver */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Receiver
            </span>
            <p className="font-bold text-slate-900 text-sm">{order.receiver?.name}</p>
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-slate-400" /> {order.receiver?.phone}
            </p>
            {order.receiver?.city && (
              <p className="text-xs text-slate-500">City: {order.receiver.city}</p>
            )}
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-700">
              <span className="text-slate-400 block text-[11px] font-medium">Destination Address:</span>
              {order.deliveryAddress}
            </div>
          </div>
        </div>

        {/* Parcel Info & Charges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Parcel Specification
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Category:</span>
                <p className="text-slate-800 font-semibold">{order.parcelInfo?.category || 'Standard'}</p>
              </div>
              <div>
                <span className="text-slate-400">Weight:</span>
                <p className="text-slate-800 font-semibold">{order.parcelInfo?.weight || 1} KG</p>
              </div>
              <div>
                <span className="text-slate-400">Pieces / Qty:</span>
                <p className="text-slate-800 font-semibold">{order.parcelInfo?.quantity || 1}</p>
              </div>
              <div>
                <span className="text-slate-400">Billing Type:</span>
                <p className="text-slate-800 font-semibold">{order.paymentType || 'Account Billed'}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400">Contents:</span>
              <p className="text-slate-800 font-medium">{order.parcelInfo?.description}</p>
            </div>
            {order.parcelInfo?.specialInstructions && (
              <div className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium">
                <span className="font-bold block">Instructions:</span>
                {order.parcelInfo.specialInstructions}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Billing & Charges
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Delivery Service Charge:</span>
                <span className="font-bold text-slate-900 text-sm">PKR {order.deliveryCharge?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Cash on Delivery (COD):</span>
                <span className="font-bold text-emerald-600">
                  {order.codAmount > 0 ? `PKR ${order.codAmount?.toLocaleString()}` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Account Owner:</span>
                <span className="text-slate-800 font-semibold">
                  {order.userId?.name || 'Customer Account'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" /> Status & Delivery Audit Trail
          </h4>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
            {order.statusHistory?.map((item, idx) => (
              <div key={idx} className="relative flex items-start gap-4 pl-8">
                <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.status}</span>
                    <span className="text-slate-400 font-medium">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {item.note && <p className="text-slate-600 mt-0.5">{item.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </Modal>
  );
};
