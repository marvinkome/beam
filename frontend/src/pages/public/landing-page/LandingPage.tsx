import React from "react"
import { Navbar } from "../components/Navbar"
import { FaCheck } from "react-icons/fa"
import { useGoogleLogin } from "lib/hooks"
import { Footer } from "../components/Footer"
import { trackUserEvent } from "lib/GA"
import "./LandingPage.scss"

export function LandingPageView(props: { onRegister: () => void }) {
    const { signIn, loaded } = useGoogleLogin(props.onRegister)
    const signUp = (type: string) => {
        signIn()
        trackUserEvent("Sign up with CTA button", type)
    }
    return (
        <div className="landing-page">
            <div className="header-container">
                <Navbar />

                <div className="header-grid">
                    <div className="text-grid">
                        <h1>Find local friends you’ll spend hours chatting with.</h1>

                        <div className="check-list">
                            <div className="check">
                                <FaCheck className="icon" />
                                <p>Match with people near you who share your interests</p>
                            </div>

                            <div className="check">
                                <FaCheck className="icon" />
                                <p>No Ads. Ever.</p>
                            </div>

                            <div className="check">
                                <FaCheck className="icon" />
                                <p>Beam messages to your friends</p>
                            </div>

                            <div className="check">
                                <FaCheck className="icon" />
                                <p>Completely private</p>
                            </div>

                            <div className="check">
                                <FaCheck className="icon" />
                                <p>No blue theme</p>
                            </div>
                        </div>

                        <button
                            onClick={loaded ? () => signUp("header") : () => null}
                            className="btn btn-primary"
                        >
                            Sign up with Google
                        </button>
                    </div>

                    <div className="image-grid">
                        <img
                            alt="Mobile screenshot of beam"
                            src={require("assets/images/screenshot.png")}
                        ></img>
                    </div>
                </div>
            </div>

            <div className="text-container">
                <div className="text-box">
                    <h2>
                        <span>Hey folks,</span>
                    </h2>
                    <p>
                        <span>TL;DR</span>
                    </p>
                    <p>
                        <span>We&rsquo;ve built a new private social networking platform.</span>
                    </p>
                    <p>
                        <span>Its called Beam.</span>
                    </p>
                    <p>
                        <span>
                            It links your YouTube, Spotify, and Reddit accounts. Then using your
                            interests on these platforms, it matches you with someone nearby you can
                            chat with.
                        </span>
                    </p>
                    <p>
                        <span>There will never be Ads on our platform.</span>
                    </p>
                    <p>
                        <span>
                            We believe its amazing and we want you to be a part of it and the future
                            we&rsquo;re building at Beam.
                        </span>
                    </p>
                    <h2>
                        <span>Long version</span>
                    </h2>
                    <p>
                        <span>Social media sucks and we all know it.</span>
                    </p>
                    <p>
                        <span>
                            You have &ldquo;friends&rdquo; that aren&rsquo;t really your friends.
                            Followers that don&rsquo;t know the real you. People sharing the best
                            moments of their lives rather than real moments in their lives.
                        </span>
                    </p>
                    <p>
                        <span>Let&rsquo;s not mention the trolls.</span>
                    </p>
                    <p>
                        <span>
                            Facebook, Twitter, and Snap promised us a lot of things. Friends,
                            happiness, a group you can belong to&mdash;but they failed on a lot of
                            those promises.
                        </span>
                    </p>
                    <p>
                        <span>
                            Instead, social media&#39;s a place where people post glamorous images
                            of their lives and make other people feel bad for having a normal day.
                        </span>
                    </p>
                    <p>
                        <span>
                            And when those same people feel bad, they bottle it up
                            inside&mdash;because you can&rsquo;t look bad for the grams, can you?
                        </span>
                    </p>
                    <p>
                        <span>
                            Social media has become a place where people can&rsquo;t share the
                            stupid, frustrating, happy, crazy moments of their lives because
                            they&rsquo;re afraid someone will think less of them or worse; that no
                            one will even care.
                        </span>
                    </p>
                    <p>
                        <span>
                            Social media today is all about likes, shares, and retweets. And
                            Ads...so many Ads.
                        </span>
                    </p>
                    <p>
                        <span>We believe our social lives on the internet can be better.</span>
                    </p>
                    <p>
                        <span>
                            We&rsquo;re doing this by removing everything that makes &ldquo;Old
                            Social&rdquo; bad. Starting with the word &ldquo;media&rdquo;; because
                            no one&#39;s really themselves in front of the media.
                        </span>
                    </p>
                    <p>
                        <span>Ads also have to go. </span>
                    </p>
                    <p>
                        <span>
                            No one wakes up in the morning happy to see another Ad. We believe there
                            are better ways to make money on the internet beyond the outdated Ad
                            model.
                        </span>
                    </p>
                    <p>
                        <span>
                            Next to go are the fake internet points; share count, followers, and
                            likes&mdash;are all out.
                        </span>
                    </p>
                    <p>
                        <span>
                            When you take all of these away, what you&rsquo;re left with is a
                            private place where you can be authentic with real friends, share any
                            moment in your life, and ask for help without being judged.
                        </span>
                    </p>
                    <p>
                        <span>
                            As introverts ourselves, we know that there&rsquo;s a lot of loneliness
                            in the world, we&rsquo;ve all felt it.
                        </span>
                    </p>
                    <p>
                        <span>
                            And that&#39;s why we made it possible to also find other people near
                            you who share your interests on platforms like YouTube, Spotify, and
                            Reddit.
                        </span>
                    </p>
                    <p>
                        <span>
                            We don&#39;t want your data for anything else. We only use your
                            location, YouTube subscriptions, Reddit subreddits, liked songs, and
                            followed artists on Spotify to match you with others you&#39;d love to
                            chat with as our planet recovers from this pandemic.
                        </span>
                    </p>
                    <p>
                        <span>
                            And if we can&#39;t find you a match immediately please give us a few
                            days as more people join and we&#39;ll try to find someone you vibe
                            with.
                        </span>
                    </p>
                    <p>
                        <span>
                            This private corner of the internet we&#39;ve made; where you can find
                            new friends that just get you and share what you want with them is
                            called Beam.
                        </span>
                    </p>
                    <p>
                        <span>
                            And because we want Beam to be a place where you engage with friends and
                            not a place to store contacts. You can only have a maximum of 15 friends
                            on your Beam account.
                        </span>
                    </p>
                    <p>
                        <span>
                            Beam keeps all the things we love about social media; finding new people
                            who share your interests, showing a friend that cool meme, or chatting
                            for hours about the things we love with someone that gets it.
                        </span>
                    </p>
                    <p>
                        <span>Beam is a place where you can be the real you.</span>
                    </p>
                    <p>
                        <span>
                            This is just the beginning, there&#39;s so much more to come. And every
                            day we&rsquo;re working really hard to make beaming your friends an
                            amazing experience.
                        </span>
                    </p>
                    <p>
                        <span>
                            Finally, rather than being hosted on the Play Store or App Store, Beam
                            is a progressive web app.
                        </span>
                    </p>
                    <p>
                        <span>
                            Meaning you can open it on any mobile browser with just the link (
                            <span className="text-link">usebeam.chat</span>) but the beauty is that
                            you can also download it through your browser and it&#39;ll work just
                            like any app on your phone.
                        </span>
                    </p>
                    <p>
                        <span>
                            There&#39;s no distinction between Android and IOS users. The future we
                            want to help build is amazing and we want you with us.
                        </span>
                    </p>
                    <p>
                        <span>
                            So if this makes sense to you: sign up with google and tell everyone you
                            know about Beam.
                        </span>
                    </p>

                    <div className="text-box-cta">
                        <button
                            className="btn btn-primary"
                            onClick={loaded ? () => signUp("bottom") : () => null}
                        >
                            Sign up with Google
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
