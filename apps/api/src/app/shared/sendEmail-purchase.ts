import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
const configService = new ConfigService();

export const EmailPurchase = async (subject: string, header: string, email: string, clientName: string, phone: string, address: string) => {

  return new Promise((resolve, reject) => {
    nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: configService.get('MAIL_HOST'),
      port: configService.get('MAIL_PORT'),
      secure: true,
      auth: {
        user: configService.get('MAIL_USER'),
        pass: configService.get('MAIL_PASSWORD')
      },
    });

    const mailOptions= {
      from: `"الرصانة للمواد الصحية"` + email,
      to: '<contact@artyclic.com>',
      subject: `${subject}`,
      html: `
        <style type="text/css">
          a { color: #0000ee; text-decoration: underline; }
          @media only screen and (min-width: 620px) {
          .u-row {
          width: 600px !important;
          }
          .u-row .u-col {
          vertical-align: top;
          }

          .u-row .u-col-100 {
          width: 600px !important;
          }

          }

          @media (max-width: 620px) {
          .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
          }
          .u-row .u-col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
          }
          .u-row {
          width: calc(100% - 40px) !important;
          }
          .u-col {
          width: 100% !important;
          }
          .u-col > div {
          margin: 0 auto;
          }
          }
          body {
          margin: 0;
          padding: 0;
          }

          table,
          tr,
          td {
          vertical-align: top;
          border-collapse: collapse;
          }

          p {
            margin: 3% 0;
          }

          .ie-container table,
          .mso-container table {
          table-layout: fixed;
          }

          * {
          line-height: inherit;
          }

          a[x-apple-data-detectors='true'] {
          color: inherit !important;
          text-decoration: none !important;
          }
        </style>

        <div class="clean-body" style="margin: 2% 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #b88401">
        <!--[if IE]><div class="ie-container"><![endif]-->
        <!--[if mso]><div class="mso-container"><![endif]-->
        <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
          <tbody>
            <tr style="vertical-align: top">
              <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->

                <!-- icon + Header -->
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #b88401;">
                    <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #003399;"><![endif]-->

                      <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                        <div style="width: 100% !important;">
                        <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                          <!-- Email icon -->
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:'Cabin',sans-serif;" align="left">
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                      <img align="center" border="0" src="https://dl.dropboxusercontent.com/s/urvdg3y0rcr3ybx/image-5.png?dl=0" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 26%;max-width: 150.8px;" width="150.8"/>
                                    </td>
                                  </tr>
                                </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <!-- Header -->
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 31px;font-family:'Cabin',sans-serif;" align="left">
                                  <div style="color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
                                    <p style="font-size: 14px; line-height: 140%;">
                                      <span style="font-size: 28px; line-height: 39.2px;">
                                        <strong><span style="line-height: 39.2px; font-size: 28px;">${header}</span></strong>
                                      </span>
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                        <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>

                <!-- Body -->
                <div class="u-row-container" style="padding: 0px;background-color: transparent;">
                  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                    <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->

                      <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div class="u-col u-col-100" style=" background-color: #e5eaf5; max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                        <div style="width: 100% !important;">
                        <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px;font-family:'Cabin',sans-serif;" align="left">
                                  <div style="color: #000000; line-height: 160%; word-wrap: break-word;">
                                    <p style="text-transform: uppercase; font-size: 14px; line-height: 160%; text-align: center;"><span style="font-size: 22px; line-height: 35.2px;">Subject: ${subject}</span></p>
                                    <p style="font-size: 14px; line-height: 160%;  text-align: left; margin-top: 10%;">
                                      <span style="font-size: 18px; line-height: 28.8px; ">Client Name: ${clientName}</span>
                                    </p>
                                    <p style="font-size: 14px; line-height: 160%; text-align: left;">
                                    <span style="font-size: 18px; line-height: 28.8px;">Phone Number: ${phone}</span>
                                  </p>
                                  <p style="font-size: 14px; line-height: 160%; text-align: left;">
                                    <span style="font-size: 18px; line-height: 28.8px;">Email:  ${email}</span>
                                  </p>
                                  <p style="font-size: 14px; line-height: 160%; text-align: left;">
                                    <span style="font-size: 18px; line-height: 28.8px;">Subjec: ${address}</span>
                                  </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #b88401;">
                    <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #003399;"><![endif]-->
                      <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                        <div style="width: 100% !important;">
                        <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
                                  <div style="color: #fafafa; line-height: 180%; text-align: center; word-wrap: break-word;">
                                    <p style="font-size: 14px; line-height: 180%;"><span style="font-size: 16px; line-height: 28.8px;">Copyrights &copy; All Rights Reserved</span></p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        <!--[if mso]></div><![endif]-->
        <!--[if IE]></div><![endif]-->
      </div>
    `,
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        Logger.error('🟥 Email sent Failure ', error);
        reject(error);
      } else {
        Logger.log('🟩 Email sent successfully ', info);
        resolve(true);
      }
    });
  })
}
