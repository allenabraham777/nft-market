import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormikInput from "../../components/Input";
import ImagePicker from "./ImagePicker";
import SubmitButton from "./SubmitButton";
import TextArea from "./TextArea";

type CreationFormProps = {
  onSubmit: (values: CreationValues) => Promise<void>;
};

export const creationValidationSchema = Yup.object().shape({
  name: Yup.string().required("Must enter a name"),
  description: Yup.string().required("Must enter a description"),
  image: Yup.mixed().test("is_defined", "Must select an image", (value) =>
    Boolean(value)
  ),
});

const CreationForm = ({ onSubmit }: CreationFormProps) => {
  const initialValues: CreationValues = { name: "", description: "" };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={creationValidationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      onSubmit={onSubmit}
    >
      <Form className="flex flex-col w-96 mx-auto space-y-6">
        <ImagePicker name="image" className="w-full" />
        <FormikInput name="name" placeholder="name" />
        <TextArea name="description" placeholder="description..."  className="h-60 border-2 rounded-md p-2"/>
        <SubmitButton />
      </Form>
    </Formik>
  );
};

export default CreationForm;
