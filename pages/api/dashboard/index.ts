import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../lib/withSession";
import { data } from "./mock"

async function listRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req?.method !== "GET") {
        res.status(404).send({});
        return;
    }

    res.status(200).send({
        data
    });
}

export default withSessionRoute(listRoute);
