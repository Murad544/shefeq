import { localizeTree } from "./localizeDom";
import { translate } from "./translations";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import { formatDate } from "../utils/formatters";

test("switches text and accessible labels without changing user input", () => {
  const root = document.createElement("div");
  root.innerHTML = '<button aria-label="Menyunu aç">Daxil ol</button><input placeholder="E-poçt" value="user@example.com"><span translate="no">Ad</span>';
  document.body.appendChild(root);

  localizeTree(root, "en");
  expect(root.querySelector("button").textContent).toBe("Sign in");
  expect(root.querySelector("button").getAttribute("aria-label")).toBe("Open menu");
  expect(root.querySelector("input").placeholder).toBe("Email");
  expect(root.querySelector("input").value).toBe("user@example.com");
  expect(root.querySelector("span").textContent).toBe("Ad");

  localizeTree(root, "ru");
  expect(root.querySelector("button").textContent).toBe("Войти");
  expect(root.querySelector("input").placeholder).toBe("Электронная почта");

  localizeTree(root, "az");
  expect(root.querySelector("button").textContent).toBe("Daxil ol");
  root.remove();
});

test("preserves personal data in translated dynamic messages", () => {
  expect(translate("Salam, Leyla Əliyeva. Zəhmət olmasa hesabınız üçün parol təyin edin.", "en"))
    .toBe("Hello, Leyla Əliyeva. Please set a password for your account.");
});

test("language switcher updates new content and persists the choice", async () => {
  window.localStorage.removeItem("sg_language");
  const LocalizedDate = () => {
    useLanguage();
    return <p>{formatDate("2026-09-24T12:00:00Z", "DD MMMM YYYY")}</p>;
  };
  render(
    <LanguageProvider>
      <LanguageSwitcher />
      <p>Dron tədrisi və praktiki təlimlər</p>
      <LocalizedDate />
    </LanguageProvider>
  );

  fireEvent.click(screen.getByRole("button", { name: "Русский" }));
  expect(screen.getByText("Обучение управлению дронами и практические занятия")).toBeTruthy();
  expect(screen.getByText(/сентября/)).toBeTruthy();
  expect(window.localStorage.getItem("sg_language")).toBe("ru");

  const portalMessage = document.createElement("div");
  portalMessage.textContent = "Giriş məlumatları yanlışdır";
  document.body.appendChild(portalMessage);
  await waitFor(() => expect(portalMessage.textContent).toBe("Неверный адрес электронной почты или пароль"));
  portalMessage.remove();
  window.localStorage.removeItem("sg_language");
});
