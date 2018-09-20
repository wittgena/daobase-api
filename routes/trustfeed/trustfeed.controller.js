import Campaign from '../../models/campaign';
import KYCApplication from '../../models/kycApplication';
import * as te from '../../typedError';
import view from '../../views/adminCampaign';
import User from '../../models/user';
import sendMail from '../../models/mailer';

exports.kycsToReview = async (req, res) => {
  try {
    let out = await KYCApplication.pendingVerification(req.query.offset);
    res.status(200).send(out);
  } catch (err) {
    te.handleError(err, res);
  }
};

exports.kycReviewed = async (req, res) => {
  try {
    if (!req.body.kycID) {
      throw new te.TypedError(400, 'no KYC ID provided');
    }
    const id = te.stringToId(req.body.kycID);
    let kyc = await KYCApplication.findOne({ _id: id }).exec();
    if (!kyc) {
      throw new te.TypedError(404, 'no such KYC');
    }

    // TODO: localise the email text
    let user = await User.findOne({ _id: kyc.user });
    if (!user) {
      throw new te.TypedError(404, 'no such user');
    } else if (!user.currentEmail || !user.currentEmail.verifiedAt) {
      throw new te.TypedError(404, 'user has no verified email');
    }

    const body =
`Hello,
We are happy to inform you that your KYC application has succeeded. Please feel free to make full use of our services.

Thank you,
The TrustFeed team`;

    sendMail(user.currentEmail.address, 'DaoBase KYC Success', body, body, () => {});
    kyc.verify();
    res.status(201).send({ message: 'verified' });
  } catch (err) {
    te.handleError(err, res);
  }
};

exports.kycFailed = async (req, res) => {
  try {
    if (!req.body.kycID) {
      throw new te.TypedError(400, 'no KYC ID provided');
    }
    if (!req.body.note) {
      throw new te.TypedError(400, 'no note provided');
    }

    const id = te.stringToId(req.body.kycID);
    let kyc = await KYCApplication.findOne({ _id: id }).exec();
    if (!kyc) {
      throw new te.TypedError(404, 'no such KYC');
    }

    // TODO: localise the email text
    let user = await User.findOne({ _id: kyc.user });
    if (!user) {
      throw new te.TypedError(404, 'no such user');
    } else if (!user.currentEmail || !user.currentEmail.verifiedAt) {
      throw new te.TypedError(404, 'user has no verified email');
    }

    const body =
`Hello,
We regret to inform you that your KYC application has failed. The following feedback has been provided for your application;

${req.body.note}

Thank you,
The TrustFeed team`;

    sendMail(user.currentEmail.address, 'DaoBase KYC failed', body, body, () => {});

    kyc.fail();
    res.status(201).send({ message: 'updated' });
  } catch (err) {
    te.handleError(err, res);
  }
};

exports.campaignsToReview = async (req, res) => {
  try {
    let out = await Campaign.reviewPending(req.query.offset);
    res.status(200).send({
      next: out.next,
      campaigns: out.campaigns.map(view.publicBrief),
    });
  } catch (err) {
    te.handleError(err, res);
  }
};

exports.campaignReviewed = async (req, res) => {
  try {
    if (!req.body.campaignID) {
      throw new te.TypedError(400, 'no KYC ID provided');
    }
    const id = te.stringToId(req.body.campaignID);
    let campaign = await Campaign.findOne({ _id: id }).exec();
    if (!campaign) {
      throw new te.TypedError(404, 'no such campaign');
    }

    if (campaign.hostedCampaign.campaignStatus === 'PENDING_REVIEW') {
      campaign.hostedCampaign.campaignStatus = 'REVIEWED';
      campaign.updatedAt = Date.now();
    } else if (campaign.hostedCampaign.campaignStatus === 'PENDING_OFF_CHAIN_REVIEW') {
      campaign.hostedCampaign.campaignStatus = 'DEPLOYED';
      campaign.hostedCampaign.offChainData = campaign.hostedCampaign.offChainDataDraft;
      campaign.updatedAt = Date.now();
    } else {
      throw new te.TypedError(400, 'the campaign is not pending review');
    }
    await campaign.save();

    // TODO: localise the email text
    let user = await User.findOne({ _id: campaign.hostedCampaign.user });
    if (!user) {
      throw new te.TypedError(404, 'no such user');
    } else if (!user.currentEmail || !user.currentEmail.verifiedAt) {
      throw new te.TypedError(404, 'user has no verified email');
    }

    const body =
`Hello,
We are happy to inform you that your campaign review has succeeded. 

Thank you,
The TrustFeed team`;

    sendMail(user.currentEmail.address, 'DaoBase Campaign Review Successful', body, body, () => {});
    res.status(201).send({ message: 'verified' });
  } catch (err) {
    te.handleError(err, res);
  }
};

exports.campaignFailed = async (req, res) => {
  try {
    if (!req.body.campaignID) {
      throw new te.TypedError(400, 'no campaign ID provided');
    }
    if (!req.body.note) {
      throw new te.TypedError(400, 'no note provided');
    }

    const id = te.stringToId(req.body.campaignID);
    let campaign = await Campaign.findOne({ _id: id }).exec();
    if (!campaign) {
      throw new te.TypedError(404, 'no such campaign');
    }

    if (campaign.hostedCampaign.campaignStatus === 'PENDING_REVIEW') {
      campaign.hostedCampaign.campaignStatus = 'DRAFT';
      campaign.updatedAt = Date.now();
    } else if (campaign.hostedCampaign.campaignStatus === 'PENDING_OFF_CHAIN_REVIEW') {
      campaign.hostedCampaign.campaignStatus = 'DEPLOYED';
      campaign.updatedAt = Date.now();
    } else {
      throw new te.TypedError(400, 'the campaign is not pending review');
    }
    await campaign.save();

    // TODO: localise the email text
    let user = await User.findOne({ _id: campaign.hostedCampaign.owner });
    if (!user) {
      throw new te.TypedError(404, 'no such user');
    } else if (!user.currentEmail || !user.currentEmail.verifiedAt) {
      throw new te.TypedError(404, 'user has no verified email');
    }

    const body =
`Hello,
We regret to inform you that your campaign review has failed. The following feedback has been provided for your application;

${req.body.note}

Thank you,
The TrustFeed team`;

    sendMail(user.currentEmail.address, 'DaoBase campaign review failed', body, body, () => {});

    res.status(201).send({ message: 'updated' });
  } catch (err) {
    te.handleError(err, res);
  }
};
