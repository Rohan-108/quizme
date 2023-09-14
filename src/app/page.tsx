/* eslint-disable @next/next/no-img-element */
import SignInButton from "@/components/SignInButton";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import "./homepage.css";
export default async function Home() {
  const session = await getAuthSession();
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <main className="main">
      <section className="section banner banner-section">
        <div className="container banner-column">
          <img className="banner-image" src={"/loading.gif"} alt="banner" />
          <div className="banner-inner">
            <h1 className="heading-xl">Spend Time By Playing Quizzes</h1>
            <p className="paragraph">
              Enjoy playing quizzes of different categories, your progress will
              be saved, so you can always come back to play more.
            </p>
            <SignInButton text="Get Started" />
          </div>
        </div>
      </section>
    </main>
  );
}
