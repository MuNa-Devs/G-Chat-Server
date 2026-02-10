
export function globalErrHandler(err, req, res, next){

    if (err.is_expected){
        return res.status(err.status_code).json({
            success: false,
            code: err.err_code,
            message: err.message
        });
    }

    res.status(500).json({
        success: false,
        code: "INTERNAL_ERROR",
        message: "Internal server error"
    });
}