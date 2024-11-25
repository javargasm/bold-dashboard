// tests/Login.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock de los hooks
jest.mock("@hooks/useGoTo", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    goToPage: jest.fn(),
  })),
}));
jest.mock("@context/FilterContext");

// Importar los mocks
import useGoTo from "@hooks/useGoTo";
import { useFiltersContext } from "@context/FilterContext";
import Login from "./Login";

describe("Componente Login", () => {
  beforeEach(() => {
    // Configurar los retornos de los mocks antes de cada prueba
    (useGoTo as jest.MockedFunction<typeof useGoTo>).mockReturnValue({
      goToPage: jest.fn(),
    });

    (
      useFiltersContext as jest.MockedFunction<typeof useFiltersContext>
    ).mockReturnValue({
      activePeriod: "month",
      filters: {
        viewAll: true,
        paymentTerminal: true,
        linkPayment: true,
      },
      setActivePeriod: jest.fn(),
      setFilters: jest.fn(),
    });
  });

  it("renderiza correctamente el formulario de inicio de sesión", () => {
    render(<Login />);

    // Verificar que el logo está presente
    expect(screen.getByText("BOLD")).toBeInTheDocument();

    // Verificar el título
    expect(
      screen.getByText("Inicia sesión con tu correo y contraseña")
    ).toBeInTheDocument();

    // Verificar los campos de entrada
    expect(screen.getByRole("textbox")).toBeInTheDocument(); // Campo de correo
    expect(screen.getByLabelText(/contraseña\*/i)).toBeInTheDocument(); // Campo de contraseña

    // Verificar el botón de envío
    expect(
      screen.getByRole("button", { name: /continuar/i })
    ).toBeInTheDocument();
  });

  it("permite al usuario mostrar y ocultar la contraseña", () => {
    render(<Login />);

    const passwordInput = screen.getByLabelText(
      /contraseña\*/i
    ) as HTMLInputElement;
    const toggleButton = screen.getByTestId('toggle-password')

    // Verificar que la contraseña está oculta inicialmente
    expect(passwordInput.type).toBe("password");

    // Clic en el botón para mostrar la contraseña
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");

    // Clic nuevamente para ocultar la contraseña
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });

  it("navega a la página de dashboard al enviar el formulario correctamente", () => {
    render(<Login />);

    const mockGoToPage = jest.fn();
    (useGoTo as jest.Mock).mockReturnValue({
      goToPage: mockGoToPage,
    });

    const emailInput = screen.getByRole("textbox") as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /contraseña\*/i
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /continuar/i });

    // Simular la entrada de datos
    fireEvent.change(emailInput, { target: { value: "usuario@ejemplo.com" } });
    fireEvent.change(passwordInput, { target: { value: "contraseña123" } });

    // Clic en el botón de envío
    fireEvent.click(submitButton);

    // Verificar que goToPage fue llamado con la ruta correcta
    expect(mockGoToPage).toHaveBeenCalledWith("/dashboard");
  });
});
