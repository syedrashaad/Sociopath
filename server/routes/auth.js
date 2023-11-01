const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require("crypto");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, SEND_MAIL_API_KEY } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const { info } = require("console");

// nodemailer
const nodemailer = require("nodemailer");
// const sendgridTransport = require('nodemailer-sendgrid-transport');

// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth : {
//         api_key : SEND_MAIL_API_KEY
//     }
// }))

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service

  auth: {
    user: "sociopath.prft@gmail.com",

    pass: "adgdblkowrgszffd",
  },
});
// // nodemailer

const signupEmailTemplate = (name) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      style="
        width: 100%;
        font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        padding: 0;
        margin: 0;
      "
    >
      <head>
        <meta charset="UTF-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta content="telephone=no" name="format-detection" />
        <title>New email template 2021-01-15</title>
        <!--[if (mso 16)
          ]><style type="text/css">
            a {
              text-decoration: none;
            }
          </style><!
        [endif]-->
        <!--[if gte mso 9
          ]><style>
            sup {
              font-size: 100% !important;
            }
          </style><!
        [endif]-->
        <!--[if gte mso 9
          ]><xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch> 96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml><!
        [endif]-->
        <!--[if !mso]><!-- -->
        <link
          href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i"
          rel="stylesheet"
        />
        <!--<![endif]-->
        <style type="text/css">
          #outlook a {
            padding: 0;
          }
          .ExternalClass {
            width: 100%;
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
          .es-button {
            mso-style-priority: 100 !important;
            text-decoration: none !important;
            transition: all 100ms ease-in;
          }
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }
          .es-button:hover {
            background: #555555 !important;
            border-color: #555555 !important;
          }
          .es-desk-hidden {
            display: none;
            float: left;
            overflow: hidden;
            width: 0;
            max-height: 0;
            line-height: 0;
            mso-hide: all;
          }
          @media only screen and (max-width: 600px) {
            p,
            ul li,
            ol li,
            a {
              font-size: 17px !important;
              line-height: 150% !important;
            }
            h1 {
              font-size: 30px !important;
              text-align: center;
              line-height: 120% !important;
            }
            h2 {
              font-size: 26px !important;
              text-align: left;
              line-height: 120% !important;
            }
            h3 {
              font-size: 20px !important;
              text-align: left;
              line-height: 120% !important;
            }
            h1 a {
              font-size: 30px !important;
              text-align: center;
            }
            h2 a {
              font-size: 20px !important;
              text-align: left;
            }
            h3 a {
              font-size: 20px !important;
              text-align: left;
            }
            .es-menu td a {
              font-size: 16px !important;
            }
            .es-header-body p,
            .es-header-body ul li,
            .es-header-body ol li,
            .es-header-body a {
              font-size: 16px !important;
            }
            .es-footer-body p,
            .es-footer-body ul li,
            .es-footer-body ol li,
            .es-footer-body a {
              font-size: 17px !important;
            }
            .es-infoblock p,
            .es-infoblock ul li,
            .es-infoblock ol li,
            .es-infoblock a {
              font-size: 12px !important;
            }
            *[class="gmail-fix"] {
              display: none !important;
            }
            .es-m-txt-c,
            .es-m-txt-c h1,
            .es-m-txt-c h2,
            .es-m-txt-c h3 {
              text-align: center !important;
            }
            .es-m-txt-r,
            .es-m-txt-r h1,
            .es-m-txt-r h2,
            .es-m-txt-r h3 {
              text-align: right !important;
            }
            .es-m-txt-l,
            .es-m-txt-l h1,
            .es-m-txt-l h2,
            .es-m-txt-l h3 {
              text-align: left !important;
            }
            .es-m-txt-r img,
            .es-m-txt-c img,
            .es-m-txt-l img {
              display: inline !important;
            }
            .es-button-border {
              display: inline-block !important;
            }
            .es-btn-fw {
              border-width: 10px 0px !important;
              text-align: center !important;
            }
            .es-adaptive table,
            .es-btn-fw,
            .es-btn-fw-brdr,
            .es-left,
            .es-right {
              width: 100% !important;
            }
            .es-content table,
            .es-header table,
            .es-footer table,
            .es-content,
            .es-footer,
            .es-header {
              width: 100% !important;
              max-width: 600px !important;
            }
            .es-adapt-td {
              display: block !important;
              width: 100% !important;
            }
            .adapt-img {
              width: 100% !important;
              height: auto !important;
            }
            .es-m-p0 {
              padding: 0px !important;
            }
            .es-m-p0r {
              padding-right: 0px !important;
            }
            .es-m-p0l {
              padding-left: 0px !important;
            }
            .es-m-p0t {
              padding-top: 0px !important;
            }
            .es-m-p0b {
              padding-bottom: 0 !important;
            }
            .es-m-p20b {
              padding-bottom: 20px !important;
            }
            .es-mobile-hidden,
            .es-hidden {
              display: none !important;
            }
            tr.es-desk-hidden,
            td.es-desk-hidden,
            table.es-desk-hidden {
              width: auto !important;
              overflow: visible !important;
              float: none !important;
              max-height: inherit !important;
              line-height: inherit !important;
            }
            tr.es-desk-hidden {
              display: table-row !important;
            }
            table.es-desk-hidden {
              display: table !important;
            }
            td.es-desk-menu-hidden {
              display: table-cell !important;
            }
            .es-menu td {
              width: 1% !important;
            }
            table.es-table-not-adapt,
            .esd-block-html table {
              width: auto !important;
            }
            table.es-social {
              display: inline-block !important;
            }
            table.es-social td {
              display: inline-block !important;
            }
            a.es-button,
            button.es-button {
              font-size: 14px !important;
              display: inline-block !important;
              border-width: 15px 25px 15px 25px !important;
            }
          }
        </style>
      </head>
      <body
        style="
          width: 100%;
          font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          padding: 0;
          margin: 0;
        "
      >
        <div class="es-wrapper-color" style="background-color: #f1f1f1">
          <!--[if gte mso 9]>
            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
              <v:fill type="tile" color="#f1f1f1"></v:fill> </v:background
          ><![endif]-->
          <table
            class="es-wrapper"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            style="
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              border-collapse: collapse;
              border-spacing: 0px;
              padding: 0;
              margin: 0;
              width: 100%;
              height: 100%;
              background-repeat: repeat;
              background-position: center top;
            "
          >
            <tr style="border-collapse: collapse">
              <td valign="top" style="padding: 0; margin: 0">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  class="es-header"
                  align="center"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    table-layout: fixed !important;
                    width: 100%;
                    background-color: transparent;
                    background-repeat: repeat;
                    background-position: center top;
                  "
                >
                  <tr style="border-collapse: collapse">
                    <td align="center" style="padding: 0; margin: 0">
                      <table
                        class="es-header-body"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                          background-color: #ffffff;
                          width: 600px;
                        "
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#ffffff"
                        align="center"
                        data-darkreader-inline-bgcolor
                      >
                        <tr style="border-collapse: collapse">
                          <td
                            style="
                              margin: 0;
                              padding-top: 30px;
                              padding-bottom: 30px;
                              padding-left: 40px;
                              padding-right: 40px;
                              background-color: #333333;
                            "
                            bgcolor="#333333"
                            align="left"
                            data-darkreader-inline-bgcolor
                          >
                            <table
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr style="border-collapse: collapse">
                                <td
                                  valign="top"
                                  align="center"
                                  style="padding: 0; margin: 0; width: 520px"
                                >
                                  <table
                                    width="100%"
                                    cellspacing="0"
                                    cellpadding="0"
                                    role="presentation"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr style="border-collapse: collapse">
                                      <td
                                        align="center"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          font-size: 0px;
                                        "
                                      >
                                        
                                        <img
                                          src="https://res.cloudinary.com/dsgffm6ew/image/upload/v1693392690/sociopath_prev_ui_peyadr.png"
                                          alt
                                          style="
                                            display: block;
                                            border: 0;
                                            outline: none;
                                            text-decoration: none;
                                            -ms-interpolation-mode: bicubic;
                                          "
                                          width="125"
                                        />
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table
                  class="es-content"
                  cellspacing="0"
                  cellpadding="0"
                  align="center"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    table-layout: fixed !important;
                    width: 100%;
                  "
                >
                  <tr style="border-collapse: collapse">
                    <td align="center" style="padding: 0; margin: 0">
                      <table
                        class="es-content-body"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                          background-color: #333333;
                          width: 600px;
                        "
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#333333"
                        align="center"
                        data-darkreader-inline-bgcolor
                      >
                        <tr style="border-collapse: collapse">
                          <td
                            style="
                              margin: 0;
                              padding-top: 40px;
                              padding-bottom: 40px;
                              padding-left: 40px;
                              padding-right: 40px;
                              background-image: url(https://nwbthr.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png);
                              background-repeat: no-repeat;
                            "
                            align="left"
                            background="https://nwbthr.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png"
                          >
                            <table
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr style="border-collapse: collapse">
                                <td
                                  valign="top"
                                  align="center"
                                  style="padding: 0; margin: 0; width: 520px"
                                >
                                  <table
                                    width="100%"
                                    cellspacing="0"
                                    cellpadding="0"
                                    role="presentation"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr style="border-collapse: collapse">
                                      <td
                                        align="center"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-bottom: 10px;
                                          padding-top: 40px;
                                        "
                                      >
                                        <h1
                                          style="
                                            margin: 0;
                                            line-height: 36px;
                                            mso-line-height-rule: exactly;
                                            font-family: lato, 'helvetica neue',
                                              helvetica, arial, sans-serif;
                                            font-size: 30px;
                                            font-style: normal;
                                            font-weight: bold;
                                            color: #ffffff;
                                          "
                                          data-darkreader-inline-color
                                        >
                                          WELCOME TO SOCIOPATH, ${name}
                                        </h1>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table
                  class="es-content"
                  cellspacing="0"
                  cellpadding="0"
                  align="center"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    table-layout: fixed !important;
                    width: 100%;
                  "
                >
                  <tr style="border-collapse: collapse">
                    <td align="center" style="padding: 0; margin: 0">
                      <table
                        class="es-content-body"
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#6fa8dc"
                        align="center"
                        data-darkreader-inline-bgcolor
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                          background-color: #6fa8dc;
                          width: 600px;
                        "
                      >
                        <tr style="border-collapse: collapse">
                          <td
                            align="left"
                            style="
                              padding: 0;
                              margin: 0;
                              padding-top: 40px;
                              padding-left: 40px;
                              padding-right: 40px;
                            "
                          >
                            <table
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr style="border-collapse: collapse">
                                <td
                                  valign="top"
                                  align="center"
                                  style="padding: 0; margin: 0; width: 520px"
                                >
                                  <table
                                    width="100%"
                                    cellspacing="0"
                                    cellpadding="0"
                                    role="presentation"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr style="border-collapse: collapse">
                                      <td
                                        class="es-m-txt-c"
                                        align="left"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 5px;
                                          padding-bottom: 15px;
                                        "
                                      >
                                        <h2
                                          style="
                                            margin: 0;
                                            line-height: 24px;
                                            mso-line-height-rule: exactly;
                                            font-family: lato, 'helvetica neue',
                                              helvetica, arial, sans-serif;
                                            font-size: 20px;
                                            font-style: normal;
                                            font-weight: bold;
                                            color: #333333;
                                          "
                                        >
                                          YOUR ACCOUNT IS NOW ACTIVE
                                        </h2>
                                      </td>
                                    </tr>
                                    <tr style="border-collapse: collapse">
                                      <td
                                        align="left"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-bottom: 10px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            -webkit-text-size-adjust: none;
                                            -ms-text-size-adjust: none;
                                            mso-line-height-rule: exactly;
                                            font-size: 15px;
                                            font-family: helvetica, 'helvetica neue',
                                              arial, verdana, sans-serif;
                                            line-height: 23px;
                                            color: #555555;
                                          "
                                        >
                                          Enjoy, sharing your moments with your
                                          friends, like what others are doing &amp;
                                          chat with people online...<br />
                                        </p>
                                      </td>
                                    </tr>
                                   
                            <!--[if mso]></td><td style="width:20px"></td><td style="width:460px" valign="top"><![endif]-->
                                         
                                        </p>
                                      </td>
                                    </tr>
                                    <tr style="border-collapse: collapse">
                                      <td
                                        align="left"
                                        style="padding: 0; margin: 0"
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            -webkit-text-size-adjust: none;
                                            -ms-text-size-adjust: none;
                                            mso-line-height-rule: exactly;
                                            font-size: 15px;
                                            font-family: helvetica, 'helvetica neue',
                                              arial, verdana, sans-serif;
                                            line-height: 23px;
                                            color: #555555;
                                          "
                                        >
                                          <br />
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table
                  class="es-content"
                  cellspacing="0"
                  cellpadding="0"
                  align="center"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    table-layout: fixed !important;
                    width: 100%;
                  "
                >
                  <tr style="border-collapse: collapse">
                    <td align="center" style="padding: 0; margin: 0">
                      <table
                        class="es-content-body"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                          background-color: #26a4d3;
                          width: 600px;
                        "
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#26a4d3"
                        align="center"
                        data-darkreader-inline-bgcolor
                      >
                        <tr style="border-collapse: collapse">
                          <td
                            style="
                              margin: 0;
                              padding-bottom: 20px;
                              padding-top: 40px;
                              padding-left: 40px;
                              padding-right: 40px;
                              background-color: #26a4d3;
                            "
                            bgcolor="#26a4d3"
                            align="left"
                            data-darkreader-inline-bgcolor
                          >
                            <table
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr style="border-collapse: collapse">
                                <td
                                  valign="top"
                                  align="center"
                                  style="padding: 0; margin: 0; width: 520px"
                                >
                                  <table
                                    width="100%"
                                    cellspacing="0"
                                    cellpadding="0"
                                    role="presentation"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr style="border-collapse: collapse">
                                      <td
                                        class="es-m-txt-c"
                                        align="center"
                                        style="padding: 0; margin: 0"
                                      >
                                        <h2
                                          style="
                                            margin: 0;
                                            line-height: 24px;
                                            mso-line-height-rule: exactly;
                                            font-family: lato, 'helvetica neue',
                                              helvetica, arial, sans-serif;
                                            font-size: 20px;
                                            font-style: normal;
                                            font-weight: bold;
                                            color: #ffffff;
                                          "
                                          data-darkreader-inline-color
                                        >
                                          YOUR FEEDBACK IS IMPORTANT
                                        </h2>
                                      </td>
                                    </tr>
                                    <tr style="border-collapse: collapse">
                                      <td
                                        align="center"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 5px;
                                          padding-bottom: 10px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            -webkit-text-size-adjust: none;
                                            -ms-text-size-adjust: none;
                                            mso-line-height-rule: exactly;
                                            font-size: 17px;
                                            font-family: helvetica, 'helvetica neue',
                                              arial, verdana, sans-serif;
                                            line-height: 26px;
                                            color: #aad4ea;
                                          "
                                          data-darkreader-inline-color
                                        >
                                          Let us know what you think of our latest
                                          updates<br />
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table
                  class="es-content"
                  cellspacing="0"
                  cellpadding="0"
                  align="center"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    table-layout: fixed !important;
                    width: 100%;
                  "
                >
                  <tr style="border-collapse: collapse">
                    <td align="center" style="padding: 0; margin: 0">
                      <table
                        class="es-content-body"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                          background-color: #292828;
                          width: 600px;
                        "
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#292828"
                        align="center"
                        data-darkreader-inline-bgcolor
                      >
                        <tr style="border-collapse: collapse">
                          <td
                            align="left"
                            style="
                              margin: 0;
                              padding-top: 30px;
                              padding-bottom: 30px;
                              padding-left: 40px;
                              padding-right: 40px;
                            "
                          >
                            <table
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr style="border-collapse: collapse">
                                <td
                                  valign="top"
                                  align="center"
                                  style="padding: 0; margin: 0; width: 520px"
                                >
                                  <table
                                    width="100%"
                                    cellspacing="0"
                                    cellpadding="0"
                                    role="presentation"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr style="border-collapse: collapse">
                                      <td
                                        align="center"
                                        style="padding: 0; margin: 0; font-size: 0"
                                      >
                                        <table
                                          class="es-table-not-adapt es-social"
                                          cellspacing="0"
                                          cellpadding="0"
                                          role="presentation"
                                          style="
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            border-collapse: collapse;
                                            border-spacing: 0px;
                                          "
                                        >
                                          <tr style="border-collapse: collapse">
                                            <td
                                              valign="top"
                                              align="center"
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                padding-right: 10px;
                                              "
                                            >
                                              <a
                                                target="_blank"
                                                href="https://github.com/syedrashaad/FinalProject"
                                                style="
                                                  -webkit-text-size-adjust: none;
                                                  -ms-text-size-adjust: none;
                                                  mso-line-height-rule: exactly;
                                                  font-family: helvetica,
                                                    'helvetica neue', arial, verdana,
                                                    sans-serif;
                                                  font-size: 15px;
                                                  text-decoration: underline;
                                                  color: #26a4d3;
                                                "
                                                ><img
                                                  title="GitHub"
                                                  src="https://nwbthr.stripocdn.email/content/assets/img/other-icons/circle-white/github-circle-white.png"
                                                  alt="GitHub"
                                                  width="24"
                                                  height="24"
                                                  style="
                                                    display: block;
                                                    border: 0;
                                                    outline: none;
                                                    text-decoration: none;
                                                    -ms-interpolation-mode: bicubic;
                                                  "
                                              /></a>
                                            </td>
                                            <td
                                              valign="top"
                                              align="center"
                                              style="padding: 0; margin: 0"
                                            >
                                              <a
                                                target="_blank"
                                                href="mailto:sociopath.prft@gmail.com"
                                                style="
                                                  -webkit-text-size-adjust: none;
                                                  -ms-text-size-adjust: none;
                                                  mso-line-height-rule: exactly;
                                                  font-family: helvetica,
                                                    'helvetica neue', arial, verdana,
                                                    sans-serif;
                                                  font-size: 15px;
                                                  text-decoration: underline;
                                                  color: #26a4d3;
                                                "
                                                ><img
                                                  title="Email"
                                                  src="https://nwbthr.stripocdn.email/content/assets/img/other-icons/circle-white/mail-circle-white.png"
                                                  alt="Email"
                                                  width="24"
                                                  height="24"
                                                  style="
                                                    display: block;
                                                    border: 0;
                                                    outline: none;
                                                    text-decoration: none;
                                                    -ms-interpolation-mode: bicubic;
                                                  "
                                              /></a>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table
                  cellpadding="0"
                  cellspacing="0"
                  class="es-footer"
                  align="center"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    table-layout: fixed !important;
                    width: 100%;
                    background-color: transparent;
                    background-repeat: repeat;
                    background-position: center top;
                  "
                >
                  <tr style="border-collapse: collapse">
                    <td align="center" style="padding: 0; margin: 0">
                      <table
                        class="es-footer-body"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                          background-color: #a2c4c9;
                          width: 600px;
                        "
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#a2c4c9"
                        align="center"
                        data-darkreader-inline-bgcolor
                      >
                        <tr style="border-collapse: collapse">
                          <td
                            align="left"
                            style="
                              margin: 0;
                              padding-top: 40px;
                              padding-bottom: 40px;
                              padding-left: 40px;
                              padding-right: 40px;
                            "
                          >
                            <table
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr style="border-collapse: collapse">
                                <td
                                  valign="top"
                                  align="center"
                                  style="padding: 0; margin: 0; width: 520px"
                                >
                                  <table
                                    width="100%"
                                    cellspacing="0"
                                    cellpadding="0"
                                    role="presentation"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr style="border-collapse: collapse">
                                      <td
                                        align="center"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-bottom: 10px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            -webkit-text-size-adjust: none;
                                            -ms-text-size-adjust: none;
                                            mso-line-height-rule: exactly;
                                            font-size: 12px;
                                            font-family: helvetica, 'helvetica neue',
                                              arial, verdana, sans-serif;
                                            line-height: 18px;
                                            color: #666666;
                                          "
                                        >
                                          This email was sent to you from
                                          sociopath.prft@gmail.com
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table
                  class="es-content"
                  cellspacing="0"
                  cellpadding="0"
                  align="center"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    table-layout: fixed !important;
                    width: 100%;
                  "
                >
                  <tr style="border-collapse: collapse">
                    <td align="center" style="padding: 0; margin: 0">
                      <table
                        class="es-content-body"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                          background-color: transparent;
                          width: 600px;
                        "
                        cellspacing="0"
                        cellpadding="0"
                        align="center"
                        data-darkreader-inline-bgcolor
                      >
                        <tr style="border-collapse: collapse">
                          <td
                            align="left"
                            style="
                              margin: 0;
                              padding-left: 20px;
                              padding-right: 20px;
                              padding-top: 30px;
                              padding-bottom: 30px;
                            "
                          >
                            <table
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr style="border-collapse: collapse">
                                <td
                                  valign="top"
                                  align="center"
                                  style="padding: 0; margin: 0; width: 560px"
                                >
                                  <table
                                    width="100%"
                                    cellspacing="0"
                                    cellpadding="0"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr style="border-collapse: collapse">
                                      <td
                                        align="center"
                                        style="padding: 0; margin: 0; display: none"
                                      ></td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
    
    
    `;
};

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please fill all the Fields..." });
  } else if (password.length < 7) {
    return res
      .status(422)
      .json({ error: "Password must be 8 characters or more" });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User Already Exists..." });
      }

      bycrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            name,
          });
          user.save().then((user) => {
            const mailOption = {
              to: user.email,
              from: "sociopath.prftf@gmail.com",
              subject: "Successfully Signed Up",
              html: signupEmailTemplate(user.name),
            };
            transporter.sendMail(mailOption, (error, info) => {
              if (error) {
                console.error("Error sending email:", error);
                res.status(500).json({ error: "Error sending email" });
              } else {
                console.log("Email sent:", info.response);

                res.status(200).json({ message: "Email sent successfully" });
              }
            });
          });

          return res.json({ message: "SignUp Successful..." });
        })
        .catch((err) => {
          console.log("[SIGNUP ERROR]", err);
          // res.json({message:"SignUp successful"});
        });
    })
    .catch((err) => {
      console.log("[ERROR]", err);
    });
});

// console.log("Signup success]");
// res.json({message: "Successfully SignedUp..."});
// console.log(req.body);

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "please fill all details" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email or Password.." });
    }

    bycrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({message : "Successfully Signed In.."})
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          return res.status(422).json({ error: "Invalid Email or Password.." });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

// for restting password
// send mail
router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(422).json({ error: "User not Exists.." });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      const forgotMailer = {
        to: user.email,
        from: "team5@sociopath.com",
        subject: "sociopath Password Reset",
        html: `http://localhost:3000/reset/${token}}`,
      };

      user.save().then((result) => {
        transporter.sendMail(forgotMailer, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            res.status(500).json({ error: "Error sending email" });
          } else {
            console.log("Email sent:", info.response);
            res.status(200).json({ message: "Email sent successfully" });
          }
        });
      });
      res.json({ message: "Please check your Mail..." });
    });
  });
});

// store in db
router.post("/new-password", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;

  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Try again, Session Expired.." });
      }
      bycrypt.hash(newPassword, 12).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: "Password Updated Successfully.." });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// for restting password
module.exports = router;
