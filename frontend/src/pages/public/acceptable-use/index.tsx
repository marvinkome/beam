import React, { useLayoutEffect } from "react"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import "./style.scss"

export function AcceptableUse() {
    useLayoutEffect(() => {
        document.title = "Acceptable Use Policy - Beam"
    }, [])
    return (
        <div className="terms">
            <Navbar />

            <div className="text-container">
                <div className="text-box">
                    <h1>Acceptable Use Policy</h1>

                    <p>
                        Last updated 5th <strong>August, 2020</strong>
                    </p>
                    <p>
                        This Acceptable Use Policy (this&nbsp;&ldquo;Policy&rdquo;) describes
                        prohibited uses of the products and/or services offered by{" "}
                        <a href="http://Beam.com">Beam.com</a>, (the&nbsp;&ldquo;Services&rdquo;)
                        and the website located at&nbsp;
                        <a href="http://www.beam.com">www.beam.com</a>&nbsp;(the&nbsp;&ldquo;Beam
                        Site&rdquo;). The examples described in this Policy are not exhaustive. We
                        may modify this Policy at any time by posting a revised version on the Beam
                        Site. By using the Services or accessing the Beam Site, you agree to the
                        latest version of this Policy. If you violate the Policy or authorize or
                        help others to do so, we may suspend or terminate your use of the Services.
                    </p>
                    <p>
                        <strong>NO ILLEGAL, HARMFUL, OR OFFENSIVE USE OF CONTENT</strong>
                    </p>
                    <p>
                        You may not use, or encourage, promote, facilitate or instruct others to
                        use, the Services or Beam Site for any illegal, harmful, fraudulent,
                        infringing or offensive use, or to transmit, store, display, distribute or
                        otherwise make available content that is illegal, harmful, fraudulent,
                        infringing or offensive.
                    </p>
                    <p>Prohibited activities or content include, but are not limited to:</p>
                    <p>
                        <strong>Illegal, Harmful or Fraudulent Activities:</strong>&nbsp;Any
                        activities that are illegal, that violate the rights of others, or that may
                        be harmful to others, our operations or reputation, including disseminating,
                        promoting or facilitating child pornography, offering or disseminating
                        fraudulent goods, services, schemes, or promotions, make-money-fast schemes,
                        or Ponzi and pyramid schemes.
                    </p>
                    <p>
                        <strong>Infringing Content:</strong>&nbsp;Content that infringes or
                        misappropriates the intellectual property or proprietary rights of others.
                    </p>
                    <p>
                        <strong>Offensive Content:</strong>&nbsp;Content that is defamatory,
                        obscene, abusive, invasive of privacy, or otherwise objectionable, including
                        content that is pornographic in nature or discriminatory against any race,
                        religion, or creed.
                    </p>
                    <p>
                        <strong>Harmful Content:</strong>&nbsp;Content or other computer technology
                        that may damage, interfere with, surreptitiously intercept, or expropriate
                        any system, program, or data, including viruses, Trojan horses, worms, time
                        bombs, or cancelbots.
                    </p>
                    <p>
                        <strong>NO SECURITY VIOLATIONS</strong>
                    </p>
                    <p>
                        You may not violate the security or integrity of any network, computer or
                        communications system, software application, or network or computing device
                        (each, a &ldquo;System&rdquo;). Prohibited activities include, but are not
                        limited to:
                    </p>
                    <p>
                        <strong>Unauthorized Access:</strong>&nbsp;Accessing or using any System
                        without permission, including attempting to probe, scan, or test the
                        vulnerability of a System or to breach any security or authentication
                        measures used by a System.
                    </p>
                    <p>
                        <strong>Interception:</strong>&nbsp;Monitoring of data or traffic on a
                        System without permission.
                    </p>
                    <p>
                        <strong>Third-Party Services:</strong>&nbsp;Developing any applications that
                        interact with the Services or other users&rsquo; content or information
                        without our written consent.
                    </p>
                    <p>
                        <strong>NO NETWORK ABUSE</strong>
                    </p>
                    <p>
                        You may not make network connections to any users, hosts, or networks unless
                        you have permission to communicate with them. Prohibited activities include,
                        but are not limited to:
                    </p>
                    <p>
                        <strong>User Solicitation:</strong>&nbsp;Soliciting login credentials from
                        another user or using or attempting to use another user&rsquo;s account,
                        username, or password without their permission.
                    </p>
                    <p>
                        <strong>Monitoring or Crawling</strong>:&nbsp;Monitoring or crawling of a
                        System that impairs or disrupts the System being monitored or crawled.
                    </p>
                    <p>
                        <strong>Intentional Interference:</strong>&nbsp;Interfering with the proper
                        functioning of the Services, including any deliberate attempt to overload a
                        network or System.
                    </p>
                    <p>
                        <strong>Avoiding System Restrictions:</strong>&nbsp;Using manual or
                        electronic means to avoid any use limitations placed on a System, such as
                        access, message, seat, API, bot, or contact restrictions.
                    </p>
                    <p>
                        <strong>NO E-MAIL OR OTHER MESSAGE ABUSE</strong>
                    </p>
                    <p>
                        You will not distribute, publish, send, or facilitate the sending of
                        unsolicited mass e-mail or other messages, promotions, advertising, or
                        solicitations (like &ldquo;spam&rdquo;), including commercial advertising
                        and informational announcements. You will not alter or obscure mail headers
                        or assume a sender&rsquo;s identity without the sender&rsquo;s explicit
                        permission. You will not collect replies to messages sent from another
                        internet service provider if those messages violate this Policy or the
                        acceptable use policy of that provider.
                    </p>
                    <p>
                        <strong>OUR MONITORING AND ENFORCEMENT</strong>
                    </p>
                    <p>
                        We reserve the right, but do not assume the obligation, to investigate any
                        violation of this Policy or misuse of the Services or Beam Site. We may:
                    </p>
                    <p>
                        investigate violations of this Policy or misuse of the Services or Beam
                        Site; or
                    </p>
                    <p>
                        remove, disable access to, or modify any content or resource that violates
                        this Policy or any other agreement we have with you for use of the Services
                        or the Beam Site.
                    </p>
                    <p>
                        We may report any activity that we suspect violates any law or regulation to
                        appropriate law enforcement officials, regulators, or other appropriate
                        third parties. Our reporting may include disclosing appropriate customer
                        information. We also may cooperate with appropriate law enforcement
                        agencies, regulators, or other appropriate third parties to help with the
                        investigation and prosecution of illegal conduct by providing network and
                        systems information related to alleged violations of this Policy.
                    </p>
                    <p>
                        <strong>REPORTING OF VIOLATIONS OF THIS POLICY</strong>
                    </p>
                    <p>
                        If you become aware of any violation of this Policy, please&nbsp;
                        <a href="mailto:team@usebeam.chat">contact us</a>&nbsp;immediately&nbsp;and
                        provide us with assistance, as requested, to stop or remedy the violation.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}
