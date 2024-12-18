export const getTableTitle = (activePeriod: string) => {
    switch (activePeriod) {
      case "today":
        return "Tus ventas de hoy";
      case "week":
        return "Tus ventas de esta semana";
      case "month":
        return `Tus ventas de ${new Date().toLocaleString("es-ES", {
          month: "long",
        })}`;
      default:
        return "Tus ventas";
    }
  };