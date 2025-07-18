import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

/**
 * CustomModal Component
 * A customizable modal component for displaying alerts, confirmations, or pop-up forms.
 * It replaces native alert() or confirm() for a consistent and professional UI.
 *
 * Props:
 * - visible: Boolean to control the visibility of the modal.
 * - title: The title of the modal.
 * - message: The main message or content of the modal.
 * - children: Optional React nodes to render inside the modal body (e.g., input fields, custom content).
 * - onConfirm: Function to call when the primary action button is pressed (e.g., "OK", "Confirm").
 * - onCancel: Function to call when the secondary action button or backdrop is pressed (e.g., "Cancel", "Close").
 * - confirmText: Text for the primary action button (defaults to "OK").
 * - cancelText: Text for the secondary action button (defaults to "Cancel").
 * - showCancelButton: Boolean to control the visibility of the cancel button (defaults to true).
 * - showConfirmButton: Boolean to control the visibility of the confirm button (defaults to true).
 * - dismissible: Boolean to allow dismissing the modal by tapping outside (defaults to true).
 */
const CustomModal = ({
  visible,
  title,
  message,
  children,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancelButton = true,
  showConfirmButton = true,
  dismissible = true,
}) => {
  if (!visible) {
    return null; // Don't render if not visible
  }

  return (
    <Modal
      transparent={true} // Makes the background transparent
      animationType="fade" // Smooth fade in/out animation
      visible={visible}
      onRequestClose={dismissible ? onCancel : () => {}} // Handle hardware back button on Android
    >
      <TouchableWithoutFeedback onPress={dismissible ? onCancel : undefined}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Modal Title */}
              {title && <Text style={styles.modalTitle}>{title}</Text>}

              {/* Modal Message/Content */}
              {message && <Text style={styles.modalMessage}>{message}</Text>}

              {/* Custom Children Content */}
              {children && <View style={styles.modalBody}>{children}</View>}

              {/* Action Buttons */}
              {(showCancelButton || showConfirmButton) && (
                <View style={styles.buttonContainer}>
                  {showCancelButton && (
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={onCancel}
                    >
                      <Text style={styles.cancelButtonText}>{cancelText}</Text>
                    </TouchableOpacity>
                  )}
                  {showConfirmButton && (
                    <TouchableOpacity
                      style={[styles.button, styles.confirmButton]}
                      onPress={onConfirm}
                    >
                      <Text style={styles.confirmButtonText}>{confirmText}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#282c34', // Dark background for the modal box
    borderRadius: 15, // Rounded corners
    padding: 25,
    width: '85%', // Occupy 85% of screen width
    maxWidth: 400, // Max width for larger screens
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // White title text
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#bbb', // Lighter grey for message text
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalBody: {
    marginBottom: 20, // Space below custom content
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute buttons evenly
    marginTop: 10,
  },
  button: {
    flex: 1, // Buttons take equal width
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5, // Space between buttons
  },
  cancelButton: {
    backgroundColor: '#3a3a4e', // Neutral background for cancel
  },
  cancelButtonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#6200EE', // Primary color for confirm
  },
  confirmButtonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomModal;
