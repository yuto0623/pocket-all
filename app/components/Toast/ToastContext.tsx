"use client";
import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ToastType } from "./Toast";
import ToastContainer from "./ToastContainer";

interface ToastContextProps {
	showToast: (message: string, type: ToastType, duration?: number) => string;
	hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [toasts, setToasts] = useState<
		Array<{
			id: string;
			message: string;
			type: ToastType;
			duration?: number;
		}>
	>([]);

	const showToast = useCallback(
		(message: string, type: ToastType, duration = 5000) => {
			const id = uuidv4();
			setToasts((prev) => [...prev, { id, message, type, duration }]);
			return id;
		},
		[],
	);

	const hideToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ showToast, hideToast }}>
			{children}
			<ToastContainer toasts={toasts} removeToast={hideToast} />
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = useContext(ToastContext);
	if (context === undefined) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};
