import axios from "axios";
import { subdomain } from "../common/default";
import { apiToken } from "./token";

export async function getTemplate(templateId: string): Promise<any> {
    const result = await axios.get(`https://${subdomain}.azureiotcentral.com/api/preview/deviceTemplates/${templateId}`,
        {
            headers: {
                authorization: apiToken.token
            }
        });
    return await result.data;
}
