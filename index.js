/* eslint-disable react/no-unused-state */
import React, {
  Component
} from 'react';
import {
  Container, Row, Col,
  Button,
  Form, FormGroup, FormFeedback,
  Label,
  UncontrolledAlert
} from 'reactstrap';
import {
  withRouter
} from 'react-router-dom';
import {
  connect
} from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import axios from 'axios';
import Icon from '../../components/icon';
import { Svgs } from '../../theme/Svgs';
import { env } from '../../config';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filterData: {},
      providers: [],
      states: []
    };
    this.formikRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    return axios({
      method: 'GET',
      url: `${env.apiLocation}/v2/5df42d7a3100006c00b587af`,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    }).then((response) => {
      const res = response.data.replace(/\s/g, '').replace(/}{/g, '},{');
      const data = JSON.parse(res.replace(/,}/g, '}'));
      this.setState({
        data,
        providers: this.getProviders(data),
        states: this.getStates(data)
      });
    });
  }

  getProviders(data) {
    const { providers } = this.state;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (providers.length > 0) {
        if (providers.filter(provider => provider.label === item.provider).length === 0) {
          providers.push({ label: item.provider, value: item.provider });
        }
      } else {
        providers.push({ label: item.provider, value: item.provider });
      }
    }
    return providers;
  }

  getStates(data) {
    const { states } = this.state;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (states.length > 0) {
        if (states.filter(state => state.label === item.state).length === 0) {
          states.push({ label: item.state, value: item.state });
        }
      } else {
        states.push({ label: item.state, value: item.state });
      }
    }
    return states;
  }

  handleSubmit(values, bags) {
    const { data } = this.state;
    this.setState({
      filterData: data.find(item => item.provider === values.provider.value && item.state === values.state.value)
    });
    bags.setSubmitting(false);
    this.props.history.push(`/?provider=${values.provider.value}&state=${values.state.value}`);
  }

  render() {
    const { filterData, states, providers } = this.state;
    return (
      <div className="section section-main">
        <Container>
          <Row>
            <Col md={5}>
              <Formik
                ref={this.formikRef}
                initialValues={{
                  provider: null,
                  state: null
                }}
                validationSchema={
                  Yup.object().shape({
                    provider: Yup.mixed().required('Provider is required!'),
                    state: Yup.mixed().required('State is required!')
                  })
                }
                onSubmit={this.handleSubmit}
                render={({
                  values,
                  errors,
                  status,
                  touched,
                  setFieldValue,
                  handleSubmit,
                  isSubmitting
                }) => (
                  <Form onSubmit={handleSubmit}>
                    {status && <UncontrolledAlert {...status} />}
                    <FormGroup>
                      <Label>Provider</Label>
                      <Select
                        placeholder="Provider"
                        classNamePrefix="react-select-lg"
                        options={providers}
                        getOptionValue={option => option.value}
                        getOptionLabel={option => option.label}
                        value={values.provider}
                        components={{
                          DropdownIndicator: () => (<Icon source={Svgs.iconCaretDown} />),
                          ClearIndicator: () => null
                        }}
                        onChange={(value) => {
                          setFieldValue('provider', value);
                        }}
                      />
                      {(!!errors.provider && touched.provider) && (
                        <FormFeedback className="d-block">{errors.provider}</FormFeedback>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label>State</Label>
                      <Select
                        placeholder="State"
                        classNamePrefix="react-select-lg"
                        options={states}
                        getOptionValue={option => option.value}
                        getOptionLabel={option => option.label}
                        value={values.state}
                        components={{
                          DropdownIndicator: () => (<Icon source={Svgs.iconCaretDown} />),
                          ClearIndicator: () => null
                        }}
                        onChange={(value) => {
                          setFieldValue('state', value);
                        }}
                      />
                      {(!!errors.state && touched.state) && (
                        <FormFeedback className="d-block">{errors.state}</FormFeedback>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        color="primary"
                      >
                        Submit
                      </Button>
                    </FormGroup>
                  </Form>
                )}
              />
            </Col>
            <Col md={7}>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>City</th>
                      <th>Phone number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      filterData && filterData.person && filterData.person.length > 0 ? (
                        filterData.person.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.City}</td>
                            <td>{item.phone}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center">No Results</td>
                        </tr>
                      )
                    }
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
