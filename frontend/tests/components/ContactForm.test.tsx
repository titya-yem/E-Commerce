/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Theme } from "@radix-ui/themes";
import { vi } from "vitest";
import ContactForm from "@/components/ContactForm";
import axios from "axios";
import toast from "react-hot-toast";

vi.mock("axios");

vi.mock("react-hot-toast", () => {
  const toast = {
    success: vi.fn(),
    error: vi.fn(),
  };
  return {
    __esModule: true,
    default: toast,
    ...toast,
  };
});

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits form successfully and shows success toast", async () => {
    (axios.post as any).mockResolvedValue({ data: { message: "success" } });

    render(
      <Theme>
        <ContactForm />
      </Theme>
    );

    fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email Address/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Message/i), {
      target: { value: "Hello" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Send/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/contact\/create$/),
        expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phoneNumber: "1234567890",
          message: "Hello",
        })
      );
    });

    expect(toast.success).toHaveBeenCalledWith("Message sent", {
      position: "top-center",
    });
  });

  it("shows error toast when submission fails", async () => {
    (axios.post as any).mockRejectedValue(new Error("Network error"));

    render(
      <Theme>
        <ContactForm />
      </Theme>
    );

    fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
      target: { value: "Smith" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email Address/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), {
      target: { value: "0987654321" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Message/i), {
      target: { value: "Need help" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Send/i }));

    await waitFor(
      () => {
        expect(toast.error).toHaveBeenCalledWith(
          "Error to book an appointment please contact us"
        );
      },
      { timeout: 100 }
    );
  });
});
