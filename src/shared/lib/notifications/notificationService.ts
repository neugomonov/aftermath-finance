import toast from "react-hot-toast";

export const notificationService = {
  success: (message: string, duration = 5000) => {
    toast.success(message, { duration });
  },

  error: (message: string, duration = 6000) => {
    toast.error(message, { duration });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  dismissAll: () => {
    toast.dismiss();
  },
};

