import { PaymentMethod } from "@models/transaction.model";
import Image from "next/image";



const paymentMethods: Record<
  PaymentMethod,
  {
    franchises?: { VISA: object; MASTERCARD: object };
    default?: object;
    image?: string;
    altText?: string;
    displayText?: string;
  }
> = {
  CARD: {
    franchises: {
      VISA: {
        image: "./assets/icons/visa.svg",
        altText: "Visa",
        displayText: "**** 4324",
      },
      MASTERCARD: {
        image: "./assets/icons/mastercard.svg",
        altText: "Mastercard",
        displayText: "**** 1214",
      },
    },
    default: {
      image: "./assets/icons/card.svg",
      altText: "Card",
      displayText: "**** XXXX",
    },
  },
  PSE: {
    image: "./assets/icons/pse.svg",
    altText: "PSE",
    displayText: "PSE",
  },
  BANCOLOMBIA: {
    image: "./assets/icons/bancolombia.svg",
    altText: "Bancolombia",
    displayText: "Bancolombia",
  },
  DAVIPLATA: {
    image: "./assets/icons/daviplata.svg",
    altText: "Daviplata",
    displayText: "Daviplata",
  },
  NEQUI: {
    image: "./assets/icons/nequi.svg",
    altText: "Nequi",
    displayText: "Nequi",
  },
  default: {
    image: "./assets/icons/default.svg",
    altText: "Unknown",
    displayText: "Unknown Method",
  },
};

interface PaymentMethodLogoProps {
  method: PaymentMethod;
  franchise?: "VISA" | "MASTERCARD";
}

const PaymentMethodLogo = ({
  method,
  franchise,
}: PaymentMethodLogoProps) => {
  const baseClasses = "payment-method-icon";
  let methodInfo = paymentMethods[method] || paymentMethods.default!;

  if (method === "CARD" && franchise) {
    methodInfo = methodInfo?.franchises?.[franchise] ?? methodInfo.default!;
  }

  return (
    <div className="payment-method">
      <Image
        src={methodInfo.image as string}
        alt={methodInfo.altText as string}
        className={baseClasses}
        layout="fixed"
        width={50}
        height={50}
      />
      <span className="payment-method-text">{methodInfo.displayText}</span>
    </div>
  );
};

export default PaymentMethodLogo;
