var checkerAjax = (function() {
    var formRequest = function(form, formValues, formType) {
        $.ajax({
            type: form.attr('method'),
            url: Routing.generate('mco_checker_ajaxform'),
            data: new FormData(form[0]),
            processData: false,
            contentType: false
        })
        .done(function(data) {
            var success = 0;
            $.each(data, function( index, value ) {
                if (value.success) {
                    success++;
                    checkerTable.updateFileOrAddFile(value.filename, value.transactionId, formValues);
                };
            });

            if (success > 0) {
                checkerTable.draw();
                checkerTable.jumpToPageContainingResultId(data[0].transactionId);
                checkerTable.startWaitingLoop();
                if (success == 1) {
                    mcoMessage.success('File added successfuly');
                }
                else {
                    mcoMessage.success('Files added successfuly');
                }
            }
            else {
                mcoMessage.error();
            }
        })
        .fail(function(jqXHR) {
            failResponse(jqXHR, formType);
        })
    };

    var checkerStatus = function(ids) {
        checkerTable.setCheckerStatusInProgress(true);
        /**
         * Get the status for multiple files
         * @param array ids List of files ID
         *
         * @return json
         * {"status":{"fileId":{"finish":true,"tool":2,"associatedFiles":{"fileId":"fileName"}},"fileId":{"finish":false,"percent":42}}}
         */
        $.post(Routing.generate('mco_checker_status'), { ids: ids })
        .done(function(data) {
            checkerTable.setCheckerStatusInProgress(false);
            checkerTable.processCheckerStatusRequest(data.status);
        })
        .fail(function() {
            checkerTable.setCheckerStatusInProgress(false);
            $.each(ids, function(index, id) {
                statusCell.error(id);
            });
        });
    };

    var statusReportsMulti = function(reports) {
        /**
         * Get the implementation status and policy status for multiple files
         * @param array reports List of files ID and report type
         *
         * @return json
         * {"fileId":{"implemReport":{"valid":true,"fileId":"1","error":null},"policyReport":{"valid":false,"fileId":"1","error":null}}, ...}
         */
        $.post(Routing.generate('mco_checker_report_status_multi'), { reports: reports })
        .done(function(data) {
            $.each(data, function( index, result ) {
                implementationCell.success(result.implemReport, result.implemReport.fileId);

                if (result.policyReport !== undefined) {
                    policyCell.success(result.policyReport, result.policyReport.fileId);
                }
            });
        })
        .fail(function() {
            $.each(reports, function( index, report ) {
                implementationCell.error(report.id);

                if (report.policyId !== undefined) {
                    policyCell.error(report.id);
                }
            });
        });
    };

    var policyStatus = function(fileId, policyId) {
        $.get(Routing.generate('mco_checker_policy_status', { id: fileId, policy: policyId }), function(data) {
            policyCell.success(data, fileId);
        })
        .fail(function() {
            policyCell.error(fileId);
        });
    };

    var policyReport = function(fileId, policy, display) {
        $.get(Routing.generate('mco_checker_report', { id: fileId, reportType: 'policy',  displayName: 'html', policy: policy, display: display}), function(data) {
            policyCell.displayReport(fileId, data);
        })
        .fail(function() {
            policyCell.displayReportError(fileId);
        });
    };

    var implementationStatus = function(fileId, tool) {
        /**
        * Get the implementation status for a file
        * @param int id The file ID
        * @param int reportType The report type ID
        *
        * @return json
        * {"valid":true,"fileId":"fileId","error":null}
        */
        $.get(Routing.generate('mco_checker_report_status', { id: fileId, reportType: tool }), function(data) {
            implementationCell.success(data, fileId);
        })
        .fail(function() {
            implementationCell.error(fileId);
        });
    };

    var implementationReport = function(fileId, display, verbosity, tool) {
        $.get(Routing.generate('mco_checker_report', { id: fileId, reportType: tool,  displayName: 'html', display: display, verbosity: verbosity}), function(data) {
            implementationCell.displayReport(fileId, data);
        })
        .fail(function() {
            implementationCell.displayReportError(fileId);
        });
    };

    var createPolicyFromFileId = function(fileId) {
        $.get(Routing.generate('mco_checker_create_policy', { id: fileId }), function(data) {
            mediaInfoCell.createPolicySuccess(data, fileId);
        })
        .fail(function(){
            mediaInfoCell.createPolicyError(fileId);
        });
    };

    var forceAnalyze = function(fileId) {
        $.get(Routing.generate('mco_checker_force_analyze', { id: fileId }), function(data) {
            checkerTable.startWaitingLoop();
            mcoMessage.success('File reloaded successfuly');

        })
        .fail(function() {
            mcoMessage.error();
        });
    };

    var downloadImplementationReportUrl = function(fileId, tool, display, verbosity) {
        return Routing.generate('mco_checker_report_download', { id: fileId, reportType: tool,  displayName: 'html', display: display, verbosity: verbosity });
    };

    var downloadPolicyReportUrl = function(fileId, policy, display) {
        return Routing.generate('mco_checker_report_download', { id: fileId, reportType: 'policy',  displayName: 'html', policy: policy, display: display });
    };

    var downloadReportUrl = function(fileId, reportType, miFormat) {
        if ('mi' === reportType) {
            return Routing.generate('mco_checker_report_download', { id: fileId, reportType: reportType,  displayName: 'xml', miFormat: miFormat ? miFormat : ''});
        } else {
            return Routing.generate('mco_checker_report_download', { id: fileId, reportType: reportType,  displayName: 'xml' });
        }
    };

    var reportTreeUrl = function(fileId, reportType) {
        return Routing.generate('mco_checker_report', { id: fileId, reportType: reportType,  displayName: 'jstree'});
    };

    var getMediaInfoOutputList = function(fileId) {
        $.get(Routing.generate('mco_checker_mediainfo_outputlist'))
        .done(function(data) {
            mediaInfoCell.updateOutputList(data.list, fileId);
        })
    };

    // Handle fail ajax response
    var failResponse = function(jqXHR, formType) {
        if (typeof jqXHR.responseJSON !== 'undefined') {
            if (jqXHR.responseJSON.hasOwnProperty('quota')) {
                $('#' + formType).html(jqXHR.responseJSON.quota);
            }
            else if (jqXHR.responseJSON.hasOwnProperty('message')) {
                mcoMessage.error(jqXHR.responseJSON.message);
            }
            else {
                mcoMessage.error();
            }
        }
        else {
            if ('file' == formType) {
                var uploadFiles = $('#file form :file');
                mcoMessage.error('The file is too large. Allowed maximum size is ' + uploadFiles.data('file-max-size'));
            }
            else {
                mcoMessage.error();
            }
        }
    };

    return {
        formRequest: formRequest,
        checkerStatus: checkerStatus,
        statusReportsMulti: statusReportsMulti,
        policyStatus: policyStatus,
        policyReport: policyReport,
        implementationStatus: implementationStatus,
        implementationReport: implementationReport,
        createPolicyFromFileId: createPolicyFromFileId,
        forceAnalyze: forceAnalyze,
        downloadImplementationReportUrl: downloadImplementationReportUrl,
        downloadPolicyReportUrl: downloadPolicyReportUrl,
        downloadReportUrl: downloadReportUrl,
        reportTreeUrl: reportTreeUrl,
        getMediaInfoOutputList:getMediaInfoOutputList,
    };
})();
