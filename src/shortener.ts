import axios from "axios"

import IShortenParams from "./interfaces/shorten-params"

const baseUrl = "https://encurta.net/api"

const interstitialsAds = 1
const noAds = 0

class EncurtaNet {
    private apiToken: string

    constructor(apiToken: string) {
        this.apiToken = apiToken
    }

    async shorten(
        url: string,
        alias: string | null = null,
        isTextFormat: boolean = false,
        adsType: number | null = null,
    ): Promise<EncurtaNetResponse> {

        const params: IShortenParams = {
            api: this.apiToken,
            url: url
        }

        if (alias) {
            params.alias = alias
        }

        if (isTextFormat) {
            params.format = "text"
        }
            
        if (adsType !== null) {
            if (adsType === interstitialsAds) {
                params.type = interstitialsAds
            } else if (adsType === noAds) {
                params.type = noAds
            } else {
                throw new EncurtaNetError(`${adsType} is not valid ads type`) 
            } 
        }

        const response = await axios.get(baseUrl, { params })
        const dataResponse = response.data

        if (response.status !== 200) {
            throw new EncurtaNetError(
                `[Request Error] Status code: ${response.status}`)
        }

        if (dataResponse === "" || dataResponse.status === "error") {
            let message = dataResponse.message

            if (Array.isArray(message)) {
                message = message.join("")
            }
            
            throw new EncurtaNetError(message)
        }

        return new EncurtaNetResponse(dataResponse, isTextFormat)
    }
}

class EncurtaNetError extends Error {
    constructor(message: string) {
        super(`EncurtaNetError(${message})`)
    }
}

class EncurtaNetResponse {
    private responseContent: any
    private isTextFormat: boolean

    constructor(responseContent: string, isTextFormat: boolean) {
        this.responseContent = responseContent
        this.isTextFormat = isTextFormat
    }

    get() {
        return this.responseContent
    }

    getShortenedUrl(): string {
        if (this.isTextFormat) {
            throw new EncurtaNetError("It is not possible to get this data because you passed 'isTextFormat' as true")
        }
        
        return this.responseContent.shortenedUrl
    }

    getStatus(): string {
        if (this.isTextFormat) {
            throw new EncurtaNetError("It is not possible to get this data because you passed 'isTextFormat' as true")
        }

        return this.responseContent.status
    }

    getMessage(): string {
        if (this.isTextFormat) {
            throw new EncurtaNetError("It is not possible to get this data because you passed 'isTextFormat' as true")
        }

        if (Object.keys(this.responseContent).includes("message")) {
            return this.responseContent.message
        }

        return ""
    }
}

export { EncurtaNet, interstitialsAds, noAds }