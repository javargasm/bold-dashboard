import { useRouter } from "next/navigation";

const useGoTo = () => {
  const router = useRouter();

  const goToPage = (pagePath: string) => {
    return router.push(pagePath);
  };

  return { goToPage };
};

export default useGoTo;
