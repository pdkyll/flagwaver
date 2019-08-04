import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ButtonSelect from '../components/ButtonSelect';
import FileInput from '../components/FileInput';
import URLInput from '../components/URLInput';
import { fileRecordPropType } from '../types';

const FilePickerInputMode = {
    WEB: 'web',
    FILE: 'file'
};

export default class FilePickerInput extends Component {
    static propTypes = {
        label: PropTypes.node,
        value: fileRecordPropType,
        accept: PropTypes.string,
        onChange: PropTypes.func,
        onLoad: PropTypes.func,
        isValidFileType: PropTypes.func
    };

    static defaultProps = {
        label: 'Select File',
        onChange: () => {},
        onLoad: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            inputMode: FilePickerInputMode.WEB,
            url: '',
            hasSubmittedURL: false
        };

        this.validateURL = this.validateURL.bind(this);

        this.handleModeChange = this.handleModeChange.bind(this);
        this.handleURLChange = this.handleURLChange.bind(this);
        this.handleURLSubmit = this.handleURLSubmit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleFileLoad = this.handleFileLoad.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { value } = this.props;

        if (prevProps.value !== value) {
            this.setState({
                url: value && !value.file && value.url || ''
            });
        }
    }

    validateURL(value) {
        const { hasSubmittedURL } = this.state;

        return (
            (hasSubmittedURL && !value)
                ? {
                    valid: false,
                    feedback: 'Please enter a valid URL.'
                }
                : { valid: true }
        );
    }

    handleModeChange(value) {
        this.setState({
            inputMode: value,
            hasSubmittedURL: false
        });
    }

    handleURLChange(e) {
        this.setState({
            url: e.target.value,
            hasSubmittedURL: false
        });
    }

    handleURLSubmit() {
        const { onChange, onLoad } = this.props;
        const { url } = this.state;

        const value = {
            url: url,
            file: null
        };

        this.setState({ hasSubmittedURL: true });

        onChange(value);
        onLoad(value);
    }

    handleFileChange(value) {
        const { onChange } = this.props;

        onChange(value);

        this.setState({ url: '' });
    }

    handleFileLoad(value) {
        const { onChange, onLoad } = this.props;

        onChange(value);
        onLoad(value);

        this.setState({ url: '' });
    }

    render() {
        const { label, value, accept, isValidFileType } = this.props;
        const { inputMode, url } = this.state;

        return (
            <div className="form-group">
                <fieldset className="field-group">
                    <legend className="field-group-legend">
                        {label}
                    </legend>

                    <div className="field-group-body">
                        <ButtonSelect
                            label="From"
                            value={inputMode}
                            onChange={this.handleModeChange}
                            buttonClassName="btn"
                            buttonSelectedClassName="btn-primary"
                            options={[
                                {
                                    label: 'Web',
                                    value: FilePickerInputMode.WEB
                                },
                                {
                                    label: 'File',
                                    value: FilePickerInputMode.FILE
                                }
                            ]}
                        />

                        {inputMode === FilePickerInputMode.WEB && (
                            <URLInput
                                label="URL"
                                name="url"
                                value={url}
                                validator={this.validateURL}
                                onChange={this.handleURLChange}
                                onSubmit={this.handleURLSubmit}
                            />
                        )}

                        {inputMode === FilePickerInputMode.FILE && (
                            <FileInput
                                label="File"
                                name="file"
                                value={value}
                                accept={accept}
                                defaultText="Select file..."
                                onChange={this.handleFileChange}
                                onLoad={this.handleFileLoad}
                                isValidFileType={isValidFileType}
                            />
                        )}
                    </div>
                </fieldset>
            </div>
        );
    }
}
